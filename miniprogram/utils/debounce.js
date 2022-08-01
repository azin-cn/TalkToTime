export function debounce(fn, delay = 300) {
  var timer = null;
  
  return function() {
    var context = this;
    if(timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      fn.apply(context, [...arguments]);
    }, delay);
  };
}

export function throttle(fn, delay=300) {
  var timer = null;
  
  return function() {
    var context = this;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, [...arguments]);
        timer = null /* 注意需要将此时的索引变为空 */
        clearTimeout(timer) /* 索引清除此时可以不需要这个清除定时器 */
      }, delay);
    }
  };
}

export default debounce;
