import machine
from machine import Onewire, RTC, Timer
from microWebSrv import MicroWebSrv
import json
from time import sleep

# Initialize onewire & DS18B20 temperature sensor
ow = Onewire(23)
ds = Onewire.ds18x20(ow, 0)

# Pull time from Internet
rtc = RTC()
rtc.ntp_sync(server='us.pool.ntp.org', tz='PST8PDT')

# Instatiate hardware timer
tm = Timer(0)

def cb_receive_text(webSocket, msg) :
    print("WS RECV TEXT : %s" % msg)
    webSocket.SendText("Reply for %s" % msg)

def cb_receive_binary(webSocket, data) :
    print("WS RECV DATA : %s" % data)

def cb_closed(webSocket) :
    tm.deinit()  # Dispose of timer
    print("WS CLOSED")

def cb_timer(timer, websocket):
    # Store data in dict
    dict = {}
    dict['temp'] = ds.convert_read()  # Poll temperature sensor
    print(dict['temp'])
    dict['internal'] = machine.internal_temp()[1]  # Read ESP32 internal temp
    dict['time'] = rtc.now()  # Record current time
    # Convert data to JSON and send
    websocket.SendText(json.dumps(dict))
    
def cb_accept_ws(webSocket, httpClient) :
    print("WS ACCEPT")
    webSocket.RecvTextCallback   = cb_receive_text
    webSocket.RecvBinaryCallback = cb_receive_binary
    webSocket.ClosedCallback 	 = cb_closed
    # Use lambda to pass websocket to timer callback
    cb = lambda timer: cb_timer(timer, webSocket)
    # Init and start timer to poll temperature sensor
    tm.init(period=3000, callback=cb)


mws = MicroWebSrv()                 # TCP port 80 and files in /flash/www
mws.MaxWebSocketRecvLen     = 256   # Default is set to 1024
mws.WebSocketThreaded       = True  # WebSockets with new threads
mws.WebSocketStackSize      = 4096
mws.AcceptWebSocketCallback = cb_accept_ws # Function to receive WebSockets
mws.Start(threaded=False)  # Blocking call (CTRL-C to exit)

print('Cleaning up and exiting.')
mws.Stop()
tm.deinit()
rtc.clear()
ds.deinit()
ow.deinit()
