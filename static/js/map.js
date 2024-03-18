// 定义地图
let overviewMapControl = new ol.control.OverviewMap({
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: [
        new ol.layer.Tile({
          // 使用高德
         source: new ol.source.XYZ({
                        url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&lang=zh_cn&scl=1&sv=7&key=ce2bc8663af5253256250118e9455e5a',

                        crossOrigin: 'anonymous',
                        attributions: '© 高德地图'
                    })
        })

      ],
      collapsed: false
    });


var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}&lang=zh_cn&scl=1&sv=7&key=ce2bc8663af5253256250118e9455e5a', // 高德地图矢量图源URL
                crossOrigin: 'anonymous',
                attributions: '© 高德地图'
            })
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([116.391275, 39.90765]), // 北京的经纬度坐标
        projection: 'EPSG:3857',
        zoom: 10 // 地图的初始缩放级别
    }),
    // 添加控件
   controls: ol.control.defaults.defaults({
        // 在默认控件的基础上添加自定义控件
        attributionOptions: {
            collapsible: false
        }
    }).extend([
        // 添加比例尺控件
        new ol.control.ScaleLine(),
        // 添加缩放滑块控件
        new ol.control.ZoomSlider(),
        // 添加全屏控件
        new ol.control.FullScreen(),
        overviewMapControl
    ])
});

// 修改图像,显示图像
function uploadImage(url,imageId){
    var img = document.getElementById(imageId);
    var imgSrc = img.getAttribute('src');
    img.src = url;

};

// 显示range的实时数字
document.addEventListener('DOMContentLoaded', function() {
  var range = document.getElementById('high_k');
  var valueDisplay = document.getElementById('rangeValue_high');
  range.addEventListener('input', function() {
    valueDisplay.textContent = this.value;
  });
});
document.addEventListener('DOMContentLoaded', function() {
  var range = document.getElementById('low_k');
  var valueDisplay = document.getElementById('rangeValue_low');
  range.addEventListener('input', function() {
    valueDisplay.textContent = this.value;
  });
});
document.addEventListener('DOMContentLoaded', function() {
  var range = document.getElementById('mid_k');
  var valueDisplay = document.getElementById('rangeValue_mid');
  range.addEventListener('input', function() {
    valueDisplay.textContent = this.value;
  });
});
document.addEventListener('DOMContentLoaded', function() {
  var range = document.getElementById('log_k');
  var valueDisplay = document.getElementById('rangeValue_log');
  range.addEventListener('input', function() {
    valueDisplay.textContent = this.value;
  });
});
document.addEventListener('DOMContentLoaded', function() {
  var range = document.getElementById('gamma_k');
  var valueDisplay = document.getElementById('rangeValue_gamma');
  range.addEventListener('input', function() {
    valueDisplay.textContent = this.value;
  });
});


// 将元素添加到处理流程中并在容器中显示
var listProcess = Array()
var processValue = Array()
function addBadge(processName,value= 0) {
  var badgeContainer = document.getElementById("processStream");
  listProcess.push(processName)
    processValue.push(value)
  // 创建一个新的徽章
  var newBadge = document.createElement('div');
  newBadge.className = "badge rounded-pill bg-secondary";
  newBadge.textContent = processName;

  // 将徽章添加到徽章容器中
  badgeContainer.appendChild(newBadge);
  console.log(listProcess)

}

function uploadFile() {
      var formData = new FormData(document.getElementById('uploadForm'));
      fetch('/upload', {
        method: 'POST',
        body: formData
      }).then(response => {
        if (!response.ok) {
          throw new Error('Error uploading file');
        }
        return response.json(); // 解析JSON响应
      }).then(data => {
        // 服务器返回的JSON对象包含一个'url'键
          var imageUrl = data.url; // 从JSON对象中获取URL
          var location = data.location
          console.log(imageUrl);
          raw_png_location = imageUrl
        //var extent = ol.proj.transformExtent([73, 12.2, 135, 54.2], 'EPSG:4326', 'EPSG:3857');
          //var extent = location
          uploadImage(imageUrl, 'rawImage')
        map.addLayer(
          new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: imageUrl,
                projection: 'EPSG:3857',
                imageExtent: location //映射到地图的范围
            })
          })
        )
        console.log('File uploaded successfully');
        console.log(location)


        // 设置地图的中心点
        var newCenter= [location[0], location[1]]; // 将经纬度转换为地图的投影坐标系
        console.log(newCenter)
        // 更新地图的中心
        map.getView().setCenter(newCenter);
      }).catch(error => {
        console.log('Error:', error);
      });
      // 获取地图的所有图层
        var layers = map.getLayers();
        // 获取图层集合中的图层数量
        var numberOfLayers = layers.getLength();

    }


const startProcess = async function (processList, valueList, imageUrl) {
    // 存放数据
     const data = {
        processList: processList,
        paramenters: valueList,
        rawUrl: imageUrl
    };
    try {
        const response = await fetch("/preprocessing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Received data:", result);
        // 在这里处理返回的图片地址，例如将其设置为某个元素的src属性
        resultimage = document.getElementById("resultImage")
        resultimage.src = result.resultUrl;
        return result.resultUrl

    }catch (error) {
        console.error("Error calling submitData:", error);
        return "error"
    }

};
// 开始图像处理
function replaceFileExtension(url, newExtension) {
    // 使用正则表达式找到文件扩展名并替换它
    const newUrl = url.replace(/\.[^\.]+$/, `.${newExtension}`);
    return newUrl;
}
button_start_imageProcess = document.getElementById("startImageProcess")
button_start_imageProcess.addEventListener("click", function () {
    procedure = document.getElementById("procedure")
    rawPng = document.getElementById("rawImage")
    rawUrlPng = rawPng.src
    rawUrlTif = replaceFileExtension(rawUrlPng, "tif")
    console.log(rawUrlTif)
    const myPromise = new Promise((resolve, reject) => {
    // 异步操作
        console.log("开始处理图像");
        startProcess(listProcess,processValue,rawUrlTif)
    });
    myPromise.then(result => {
            console.log(result); // 输出result
        }).catch(error => {
            console.log(error);
        });
})
// 实现树状结构管理图层
function getTree() {
  // Some logic to retrieve, or generate tree structure
        var tree = [
      {
        text: "底图图层",
        icon: "fa fa-folder",
        expanded: true,
        nodes: [
          {
            text: "高德地图",
            icon: "fa fa-folder",
            nodes: [
              {
                id:    "sub-node-1",
                text:  "Sub Child Node 1",
                icon:  "fa fa-folder",
                class: "nav-level-3",
                  layer: new ol.layer.Tile({
                      source:new ol.source.XYZ({
                            url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}&lang=zh_cn&scl=1&sv=7&key=ce2bc8663af5253256250118e9455e5a', // 高德地图矢量图源URL
                            crossOrigin: 'anonymous',
                            attributions: '© 高德地图'
                      })
                  }),
                  state: { checked: true}  // 默认选中
              },
              {
                id:"sub-node-2",
                text: "osm地图",
                icon: "fa fa-folder",
                class: "nav-level-3",
                  layer: new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    state: { checked: false } // 默认no

              }
            ]
          },
          {
            text: "Sub Node 2",
             icon: "fa fa-folder"
          }
        ]
      },
      {
        text: "Node 2",
        icon: "fa fa-folder"
      },
      {
        text: "Node 3",
        icon: "fa fa-folder"
      },
      {
        text: "Node 4",
        icon: "fa fa-folder"
      },
      {
        text: "Node 5",
        icon: "fa fa-folder"
      }
    ];
  return tree;
}

$('#tree').bstreeview({ data: getTree() });




