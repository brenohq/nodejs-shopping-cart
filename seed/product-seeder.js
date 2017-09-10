var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

var products = [
  new Product({
    imagePath: 'https://twmaruji.files.wordpress.com/2017/09/samsung-galaxy-9.jpeg',
    title: 'Samsung Galaxy Tab S2 9.7-inch Wi-Fi Tablet 32GB',
    description: 'White (SM-T813NZWEXAR) w/ Samsung Level U PRO Wireless Bluetooth Headphones (EO-BN920CBEGUS) & 32GB MicroSD High-Speed Memory Card.',
    price: 497
  }),
  new Product({
    imagePath: 'https://twmaruji.files.wordpress.com/2017/09/amazon-fire-7-tablet.jpeg',
    title: 'All-New Fire 7 Tablet with Alexa',
    description: '7" Display, 8 GB, Black - with Special Offers',
    price: 79
  }),
  new Product({
    imagePath: 'https://twmaruji.files.wordpress.com/2017/09/lenovo-tab-10.jpeg',
    title: 'Lenovo Tab 10, 10-Inch Android Tablet',
    description: 'Qualcomm Snapdragon 210 Quad-Core 1.3 GHz Processor, 16 GB Storage, Slate Black, ZA1U0003US',
    price: 111
  }),
  new Product({
    imagePath: 'https://twmaruji.files.wordpress.com/2017/09/asus-zenpad-10.jpeg',
    title: 'ASUS ZenPad 10.1"',
    description: '2GB RAM, 16GB eMMC, 2MP Front / 5MP Rear Camera, Android 6.0, Tablet, Dark Gray (Z300M-A2-GR) ',
    price: 172
  }),
  new Product({
    imagePath: 'https://twmaruji.files.wordpress.com/2017/09/ipad-9-7.jpeg',
    title: "Apple iPad Pro 9.7-inch",
    description: "(32GB, Wi-Fi, Gold) MLMQ2LL/A",
    price: 408
  }),
  new Product({
    imagePath: 'https://twmaruji.files.wordpress.com/2017/09/acert-10-mediatek.jpeg',
    title: "Acer 10.1\" Tablet",
    description: "MediaTek MT8163 Quad-Core 1.",
    price: 99
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}