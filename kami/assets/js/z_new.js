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

// 预加载所有背景图片
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

var delay=2000;
var i=0;
var player;
var _prog;
var music_i = 0;
var scrollTimer = null; // 添加定时器ID
var songlist = [
  "./kami/assets/file/1.mp3",
  "./kami/assets/file/7.mp3",
  "./kami/assets/file/2.mp3",
  "./kami/assets/file/3.mp3",
  "./kami/assets/file/4.mp3"
];
var songname = [
  "梶浦由記 - Never leave you alone",
  "梶浦由記 - 魔法少女のテーマ",
  "梶浦由記 - Sagitta luminis",
  "Kalafina - 君の銀の庭",
  "梶浦由記 - Decretum(宿命)"
];
var bginfo = [
  "Background by <a href='https://www.pixiv.net/member_illust.php?mode=medium&illust_id=48824021' target='_blank'>lyiet</a>",
  "Background by <a href='https://www.pixiv.net/artworks/39874924' target='_blank'>Panciii</a>",
  "Background by <a href='https://www.pixiv.net/member_illust.php?mode=medium&illust_id=61105326' target='_blank'>saihate▽月曜南セ22a</a>",
  "Background by <a href='https://www.pixiv.net/member_illust.php?mode=medium&illust_id=61330061' target='_blank'>霜葉</a>",
  "Background by <a href='https://www.pixiv.net/member_illust.php?mode=medium&illust_id=44413046' target='_blank'>ぱち＠お仕事募集中</a>"
];
var music_duration;

function scrollit(){
  // 清除之前的定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
  
  var $ftxt = $('.ftxt p');
  if(i < $ftxt.length){
    $ftxt.eq(i).fadeIn(4000);
    i++;
    // 保存定时器ID
    scrollTimer = setTimeout(scrollit, delay);
  } else {
    // 所有文本显示完毕，清除定时器
    scrollTimer = null;
  }
}

function playMusic() {
  if (player.paused){
        player.play();
    }else {
        player.pause();
    }
}
function set_music_progress(){
  _prog = (Number(player.currentTime).toFixed(2) / music_duration * 100).toFixed(2);
  $(".progress-bar").attr("aria-valuenow",_prog);
  $(".progress-bar").css("width",_prog+"%");
}

function change_music(){
  $('.swiper-pagination span');
}

function load_music(a){
  // 检查索引是否有效
  if (a < 0 || a >= songlist.length) {
    console.log('无效的音乐索引:', a);
    return;
  }
  
  // 暂停当前播放的音乐
  if (!player.paused) {
    player.pause();
  }
  
  $('#music_name').html(songname[a]);
  $('#bginfo').html(bginfo[a]);
  
  // 只在音乐源不同时才加载
  var currentSrc = player.src || "";
  var newSrc = songlist[a] || "";
  
  // 比较完整路径，避免因相对路径差异导致重复加载
  if (currentSrc.indexOf(newSrc) === -1 && newSrc.indexOf(currentSrc) === -1) {
    player.src = songlist[a];
    player.load();
    // 尝试播放音乐，如果失败（浏览器自动播放策略），则等待用户交互
    try {
      var playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          console.log('音乐播放成功');
        }).catch(function(e) {
          // 只在非AbortError时记录日志
          if (e.name !== 'AbortError') {
            console.log('自动播放被阻止，等待用户交互', e);
          }
        });
      }
    } catch (e) {
      console.log('播放音乐时出错', e);
    }
  }
}

function index_int(){
  player = $("#audio")[0];
  $('#music_btn_play').click(function(){
    playMusic();
  });

  $(".progress").click(function(e){
    var x=$(this).offset().left;
    var _x=e.clientX;
    var _wh = $(".progress").width();
    var __i = (_x - x) / _wh;
    player.currentTime = music_duration * __i;
  });

  $('audio').bind('timeupdate', function(){
    set_music_progress();
  });
  $('audio').bind('pause', function(){
    $(".music_progress").fadeOut(500);
    $("#music_btn_play").addClass("icon-play-circle");
    $("#music_btn_play").removeClass("icon-pause-circle");
  });
  $('audio').bind('ended',function(){
    var i = Number(music_i)+1;
    if(i == songlist.length)
    {
      $('.swiper-pagination-bullet').eq(0).trigger("click");
    }
    else{
      $('.swiper-pagination-bullet').eq(i).trigger("click");
    }
  });
  $('audio').bind('durationchange',function(){
    music_duration = player.duration;
  });
  $('audio').bind('play', function(){
    music_duration = player.duration;
    $(".music_progress").fadeIn(500);
    $("#music_btn_play").addClass("icon-pause-circle");
    $("#music_btn_play").removeClass("icon-play-circle");
  });
  $('.swiper-pagination-bullet').each(function(i,b){
    $(b).attr("tid",i);
  });

  var ul = document.querySelector(".swiper-pagination");
  var isChangingMusic = false; // 添加标志位，防止重复加载音乐
  var lastChangeTime = 0; // 记录上次切换时间
  var minChangeInterval = 500; // 最小切换间隔（毫秒）
  
  var Observer = new MutationObserver(function (mutations, instance) {
    var now = Date.now();
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        var target = mutation.target;
        if (target.classList.contains('swiper-pagination-bullet-active')) {
          var tid = target.getAttribute("tid");
          // 检查时间间隔，防止短时间内重复触发
          if (tid !== music_i && !isChangingMusic && (now - lastChangeTime) > minChangeInterval) {
            isChangingMusic = true; // 设置标志位
            lastChangeTime = now; // 更新最后切换时间
            music_i = tid;
            console.log('切换到音乐:', music_i);
            load_music(tid);
            // 延迟重置标志位，确保音乐加载完成
            setTimeout(function() {
              isChangingMusic = false;
            }, 1000);
          }
        }
      }
    });
  });

  Observer.observe(ul, {
    attributes: true,
    subtree: true
  });

  // 添加页面卸载时的清理函数
  window.addEventListener('beforeunload', function() {
    // 清除定时器
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    // 停止MutationObserver
    if (Observer) {
      Observer.disconnect();
    }
    // 停止音乐播放
    if (player && !player.paused) {
      player.pause();
    }
  });

  scrollit();
  load_music(0);
}