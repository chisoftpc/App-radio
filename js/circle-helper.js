!function(){var t,i,a=document.getElementById("page-snaplistview");a.addEventListener("pagebeforeshow",function(){var e;(i=a.querySelector(".ui-scroller"))&&(e=i.querySelector(".ui-listview")),i&&e&&(t=tau.helper.SnapListStyle.create(e,{animate:"scale"}))}),a.addEventListener("pagebeforehide",function(){t&&(t.destroy(),t=null)})}(),document.addEventListener("tauinit",function(){tau.support.shape.circle&&(document.addEventListener("pagebeforeshow",function(e){var t=e.target,i=tau.widget.Page(t),e=t.id;i.option("enablePageScroll")&&tau.util.rotaryScrolling.enable(t.querySelector(".ui-scroller")),t.classList.contains("page-snaplistview")||"page-snaplistview"===e||"page-swipelist"===e||"page-marquee-list"===e||"page-multiline-list"===e||"drawer-page"===e||(t=t.querySelector(".ui-listview"))&&tau.widget.Listview(t)},!0),document.addEventListener("pagebeforehide",function(e){e=e.target;tau.widget.Page(e).option("enablePageScroll")&&tau.util.rotaryScrolling.disable(e.querySelector(".ui-scroller"))}),document.addEventListener("popupshow",function(e){e=e.target;tau.util.rotaryScrolling.enable(e.querySelector(".ui-popup-wrapper"))}),document.addEventListener("popuphide",function(){tau.util.rotaryScrolling.disable()}))});