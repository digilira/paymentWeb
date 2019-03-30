var socket = io.connect('https://payment.digilira.com:8080', {secure: true});

var mobile = 0;
var ua = navigator.userAgent;
if (ua.match(/(iPhone|iPod|iPad|BlackBerry|Android)/)) {mobile = 1;}

function getDiv(DIV) {
	var frame = document.getElementById(DIV);
	return frame;
}


socket.on('result1', function(data){
	var frame = getDiv('productQR');
	var qrdiv = getDiv('product-QR');
	var info =  getDiv('product-title');
	var price =  getDiv('product-price');

	var qrcode = data.qrcode;

	info.textContent = ( data.item);
	price.textContent = ( data.coin + ":" + data.para + "\n" + data.adres );

	$(qrdiv).empty();
	$(qrdiv).qrcode(qrcode);
        $(qrdiv).unbind();
	$(qrdiv).click(function(){

		var win = window.open(qrcode, '_blank');
		win.focus();
	});

	var buybutton = document.createElement('div');
	buybutton.className = 'btn btn-primary btn-block btn-xs';
	buybutton.textContent = "Pay with WavesKeeper";

	buybutton.onclick = function () {
		$(info).text(data.item);
		app.send(data.adres, data.asset, (data.para).toString(), data.div, data.uuid);
	}

	var seperator = document.createElement('div');
	seperator.id = 'seperator'; 
	seperator.className = 'product-buttons'; 
	price.appendChild(seperator);

	price.appendChild(buybutton);

	frame.style.display = "block";

	socket.emit('blockchain', {
		key:data.uuid,
	});



});





socket.on('fetch', function(data){

	var container_root = document.createElement('div');
	container_root.className = 'container'; 

	var row_root = document.createElement('div');
	row_root.className = 'row'; 

	var colsm9 = document.createElement('div');
	colsm9.className = 'col-sm-9';

	var colsm3 = document.createElement('div');
	colsm3.className = 'col-sm-3'; 
	colsm3.id = "col-sm-3";

	var productQR = document.createElement('div');
	productQR.className = 'QR'; 
	productQR.id = 'productQR'; 

	var QR = document.createElement('div');
	QR.className = 'image'; 
	QR.id = 'product-QR'; 
	productQR.appendChild(QR);

	var QRTitle = document.createElement('div');
	QRTitle.className = 'product-title'; 
	QRTitle.id = 'product-title'; 
	productQR.appendChild(QRTitle);

	var QRPrice = document.createElement('div');
	QRPrice.id = 'product-price'; 
	QRPrice.className = 'product-buttons'; 
	productQR.appendChild(QRPrice);

	productQR.style.display = "none";


	var row_root2 = document.createElement('div');
	row_root2.className = 'row'; 

	document.getElementsByTagName('body')[0].appendChild(container_root);
	container_root.appendChild(row_root);

	row_root.appendChild(colsm9);
	colsm3.appendChild(productQR);

	row_root.appendChild(colsm3);
	colsm9.appendChild(row_root2);



	data[0].forEach(function(element) {


		var container = document.createElement('div');
		container.id = element.key;
		row_root2.appendChild(container);


		var colsm4 = document.createElement('div');
		colsm4.className = 'col-sm-4'; 
		container.appendChild(colsm4);


		var product = document.createElement('div');
		product.className = 'product'; 
		colsm4.appendChild(product);

		var picture = document.createElement('div');
		picture.className = 'image';

		var img = document.createElement('img');
		img.src = 'image/' + element.key + '.jpg';
		img.style.height = "200px";

		img.onload = function() { 
			picture.appendChild(img); 
		}

		img.onerror = function() {
			picture.textContent = element.key;
		}

		product.appendChild(picture);

		var productdesc = document.createElement('div');
		productdesc.className = 'product-desc'; 
		product.appendChild(productdesc);

		var producttitle = document.createElement('div');
		producttitle.className = 'product-title'; 
		producttitle.textContent = element.value['item'];
		productdesc.appendChild(producttitle);

		var productprice = document.createElement('div');
		productprice.className = 'product-price'; 
		productprice.textContent = element.value['name'] + " " + element.value['amount'];
		productdesc.appendChild(productprice);


		var productbuttons = document.createElement('div');
		productbuttons.className = 'product-buttons';
		productdesc.appendChild(productbuttons);


		var formgroup = document.createElement('div');
		formgroup.className = 'form-group'; 
		productbuttons.appendChild(formgroup);


		var label = document.createElement("LABEL");
		label.textContent = "Choose Coin"; 
		formgroup.appendChild(label);

		var selCoin = document.createElement("select");
		selCoin.class = "form-control input-sm";
		selCoin.name = "coin";
		selCoin.id = element.key + "-sid";
		for (var key in data[1]) {
			var value = data[1][key];
			selCoin.options[selCoin.length] = new Option(key, value);
		} 

		formgroup.appendChild(selCoin);

		var buybutton = document.createElement('div');
		buybutton.className = 'btn btn-primary btn-block btn-xs';
		buybutton.textContent = "Buy Now";


		buybutton.onclick = function () {

			var  e = document.getElementById (  selCoin.id  );
			var  strUser = e.options [e.selectedIndex].value;

			socket.emit('fiyat', {
				key:element.key,
				price:element.value['amount'],
				item:element.value['item'],
				amountAsset:element.value['coin'],
				priceAsset:strUser,
			});

		}

		productbuttons.appendChild(buybutton);





	});


});

socket.on('onay', function(data){
	var qrdiv = getDiv('product-QR');
	var info =  getDiv('product-title');
	var price =  getDiv('product-price');
	$(price).html("<br/><b> "  + data.value + "</b>");


});

socket.on('dataTrx', function(data){
	app.datatrx(data.type, data.key, data.value);
});


var app = new Vue({
	el: '#app',
	data: {
		node: 'https://nodes.wavesplatform.com',
		fee: '0.001',
	},
	methods: {

		fetchData:async function() {
			socket.emit('fetch', {
				data:"fetch",
			});

		}, 
		datatrx: async function (TYPE, KEY, VALUE) {
			let params = {
				type: 12,
				data: {
					fee: {
						assetId: 'WAVES',
						tokens: '0.001'
					},
					data: [
						{ type: TYPE, key: KEY, value: VALUE},
					],
				}
			} 

			if (this.checkKeeper()) {
				try {
					let res = await window.Waves.signAndPublishTransaction(params);
				} catch (err) {
					$('#bilgi').text("data hatası" );
				}
			} else {
				if (mobile == 0) { 
					alert('Please install WavesKeeper Extension.');
				}
			}


		},

		send: async function(ADRESS, COIN, AMOUNT, DIV, UUID) {
			let params = {
				type: 4,
				data: {
					amount: {
						assetId: COIN,
						tokens: AMOUNT
					},
					fee: {
						assetId: 'WAVES',
						tokens: '0.001'
					},
					recipient: ADRESS,
					attachment: UUID
				}
			}
			if (this.checkKeeper()) {
				try { 
					let res = await window.Waves.signAndPublishTransaction(params); 
					socket.emit('onay', {
						transfer:res,
						product:DIV
					});
					alert('Your payment is being processed, please wait.. ');
				} catch (err) {
					var frame = document.getElementById('productQR');
					var qrdiv = document.getElementById('product-QR');
					var info =  document.getElementById('product-title');
					var price =  document.getElementById('product-price');

					$(price).html("PAYMENT FAILED" );
				}
			} else {
				if (mobile == 0) { 
					alert('Please install WavesKeeper Extension.');
				}
			}
		},

		checkKeeper: function() {
			return typeof window.Waves !== 'undefined';
		}
	}
});
app.fetchData();

