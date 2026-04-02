// 创建一个图片加载完成的计数器
var imgLoadCount = 0;
var totalImgCount = 5;

// 图片加载完成处理函数
function handleImgLoad() {
  $(this).remove();
  imgLoadCount++;
  bgimgok();
}

// 图片加载错误处理函数
function handleImgError() {
  console.log('图片加载失败:', this.src);
  $(this).remove();
  // 即使失败也继续计数，避免loading一直显示
  imgLoadCount++;
  bgimgok();
}

$('<img/>').attr('src', './kami/assets/images/background-1.jpg').on('load', handleImgLoad).on('error', handleImgError);
$('<img/>').attr('src', './kami/assets/images/background-2.jpg').on('load', handleImgLoad).on('error', handleImgError);
$('<img/>').attr('src', './kami/assets/images/background-7.jpg').on('load', handleImgLoad).on('error', handleImgError);
$('<img/>').attr('src', './kami/assets/images/background-3.jpg').on('load', handleImgLoad).on('error', handleImgError);
$('<img/>').attr('src', './kami/assets/images/background-4.jpg').on('load', handleImgLoad).on('error', handleImgError);

$("#inloading").show();
var bgoknum = 0;
function bgimgok()
{
  bgoknum++;
  if(bgoknum == 5)
  {
    $("#inloading").hide();
    $(document).ready(function () {
      index_int();
    });
  }
}