const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const os = require('os');
const app = express();
const port = 8000;

// 設置文件存儲位置和命名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 設置圖片保存的目錄
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 使用原始文件名
  }
});

const upload = multer({ storage: storage });
app.use(cors({ origin: '*' }));
// 處理文件上傳的 POST 請求
app.post('/epaper/', upload.single('file'), (req, res) => {
  console.log('File uploaded:', req.file);
  res.send('File uploaded successfully');
});

// 使 uploads 目錄中的文件可通過網址訪問
app.use('/epaper', express.static(path.join(__dirname, 'uploads')));


// 獲取本機IP地址
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const ifaceDetails of iface) {
      if (ifaceDetails.family === 'IPv4' && !ifaceDetails.internal) {
        return ifaceDetails.address;
      }
    }
  }
  return 'localhost'; // 無法取得IP時使用localhost
};

// 啟動伺服器，動態獲取主機名
app.listen(port, () => {
  const ipAddress = getLocalIPAddress();
  console.log(`Server running at http://${ipAddress}:${port}/`);
});

