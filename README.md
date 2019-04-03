# paymentWeb

## digilira Payment Gateway Web 

# Get Started

Download this folder and put it in your http server folder.

Change this value according to your NodeJS server address. 

```
var socket = io.connect('http://localhost:8080', {secure: true});
```

# How to add a new item to your web page;

Before launching web client first you need to configure your server side (paymentServer)

At first launch an empty page will appear and an admin panel will be visible on the right side of the page.

1. Select New Item from select box
2. Name your product using 'ITEM INFORMATION' box
3. Define the amount you requested by 'AMOUNT' box
4. Select your coin
5. Click 'Add Item' button

# How to edit an existing item;

1. Select an existing item from select box
2. Edit ITEM INFORMATION, AMOUNT and COIN data and hit Add Item

WavesKeeper will request a data transaction, as soon as you approve the transaction it will be on blockchain and you will be able to see your product on your page.

# Things you need to pay attention;

1. The wallet address you defined on paymentServer should be same wallet address with WavesKeeper wallet.
2. This is a prototype application, use it at your own responsibility.
