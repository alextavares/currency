//+------------------------------------------------------------------+
//| CurrencyStrengthPusher.mq5                                       |
//| Sends a small set of FX prices to your backend every N seconds.  |
//|                                                                  |
//| Backend endpoint (default):                                      |
//|   http://161.97.106.190:3101/api/mt4/prices                      |
//|                                                                  |
//| IMPORTANT (MT5):                                                 |
//|  Tools -> Options -> Expert Advisors ->                          |
//|   "Allow WebRequest for listed URL" -> add the base URL:         |
//|    http://161.97.106.190:3101                                    |
//+------------------------------------------------------------------+
#property strict
#property version   "1.0"
#property description "Pushes FX prices to Currency Strength backend via HTTP POST"

input string EndpointUrl = "http://161.97.106.190:3101/api/mt4/prices";
input int    IntervalSeconds = 60;

// 7 majors vs USD (backend triangulates the rest)
string SYMBOLS[7] = {"EURUSD","GBPUSD","AUDUSD","NZDUSD","USDCAD","USDCHF","USDJPY"};

int OnInit()
{
   int interval = IntervalSeconds;
   if(interval < 5) interval = 5;

   // Ensure symbols are selected in Market Watch
   for(int i=0;i<ArraySize(SYMBOLS);i++)
      SymbolSelect(SYMBOLS[i], true);

   EventSetTimer(interval);
   PrintFormat("[CSM] Started. Posting every %d seconds to %s", interval, EndpointUrl);
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   EventKillTimer();
   PrintFormat("[CSM] Stopped. reason=%d", reason);
}

void OnTimer()
{
   string json = BuildJsonPrices();
   if(json == "")
   {
      Print("[CSM] No prices available; skipping POST.");
      return;
   }

   PostJson(json);
}

string BuildJsonPrices()
{
   string body = "{\"prices\":{";
   int added = 0;

   for(int i=0;i<ArraySize(SYMBOLS);i++)
   {
      double mid = 0.0;
      if(!GetMidPrice(SYMBOLS[i], mid))
         continue;

      if(added > 0) body += ",";
      body += StringFormat("\"%s\":%.5f", SYMBOLS[i], mid);
      added++;
   }

   body += "}}";
   if(added == 0) return "";
   return body;
}

bool GetMidPrice(const string symbol, double &mid)
{
   MqlTick tick;
   if(!SymbolInfoTick(symbol, tick))
   {
      int err = GetLastError();
      PrintFormat("[CSM] SymbolInfoTick failed for %s (err=%d)", symbol, err);
      ResetLastError();
      return false;
   }

   if(tick.bid <= 0 || tick.ask <= 0)
      return false;

   mid = (tick.bid + tick.ask) / 2.0;
   return true;
}

void PostJson(const string json)
{
   string headers = "Content-Type: application/json\r\n";
   char data[];
   char result[];
   string result_headers;

   // IMPORTANT: StringToCharArray appends a null-terminator; sending it breaks JSON parsing on many servers.
   StringToCharArray(json, data, 0, WHOLE_ARRAY, CP_UTF8);
   int n = ArraySize(data);
   if(n > 0 && data[n - 1] == 0)
      ArrayResize(data, n - 1);

   ResetLastError();
   int status = WebRequest("POST", EndpointUrl, headers, 15000, data, result, result_headers);
   if(status == -1)
   {
      int err = GetLastError();
      PrintFormat("[CSM] WebRequest failed (err=%d). Check: Options->Expert Advisors->Allow WebRequest URL.", err);
      ResetLastError();
      return;
   }

   if(status < 200 || status >= 300)
   {
      string resp = CharArrayToString(result, 0, WHOLE_ARRAY, CP_UTF8);
      PrintFormat("[CSM] HTTP %d. Response: %s", status, resp);
      return;
   }

   PrintFormat("[CSM] OK (HTTP %d) - posted %d bytes", status, StringLen(json));
}
