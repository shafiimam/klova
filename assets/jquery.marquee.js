/*
 * @name pluginName
 * @Rely jQuery v1.7+
 * @License MIT
 *
 * github resource repository:
 *   https://github.com/repar
 *
 * usage as:
 * m1. $.fn.pluginName({...}); 
 * m2. $(...).pluginName({...});
 *
 * author: repar
 * website: http://www.56hm.com
 * email: 47558328@qq.com,  yy47558328@sina.com
 * qq: 47558328
 */
;(function($, window, document, undefined){

    // Create the defaults once
    var pluginName = "marquee",

    defaults = {
       enable : true,  //plug-in is enabled
       direction: 'vertical',   //è¿åŠ¨æ–¹å‘.  vertical : horizontal
       itemSelecter : 'li',  //å­èŠ‚ç‚¹é€‰æ‹©å™¨
       delay: 3000,  //åŠ¨ç”»æ¸²æŸ“å»¶è¿Ÿæ—¶é—´
       speed: 1,  //åŠ¨ç”»æ¸²æŸ“è·ç¦».
       timing: 1, //åŠ¨ç”»æ¸²æŸ“é€ŸçŽ‡.
       mouse: true //é¼ æ ‡ç§»å…¥åœæ­¢åŠ¨ç”»

    };


    function Widget(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.version = 'v1.0.0';

        
        this.$element = $(this.element);
        this.$wrapper = this.$element.parent();
        this.$items = this.$element.children(this.settings.itemSelecter);


        this.next = 0;
        this.timeoutHandle;
        this.intervalHandle

        if(!this.settings.enable)return; //æ£€æµ‹æ’ä»¶æ˜¯å¦å¼€å¯.
        this.init();
    }


    Widget.prototype = {

       init:function(){

            var that = this;

           //å­èŠ‚ç‚¹å ç”¨æ€»é«˜åº¦.
            var totalSize = 0;

            $.each(this.$items, function(index, element){

                totalSize += that.isHorizontal() 
                            ? parseInt($(element).outerWidth())
                            : parseInt($(element).outerHeight());

            }); 
            
            //çˆ¶èŠ‚ç‚¹å®žé™…é«˜åº¦
            var elmentTotalSize = this.isHorizontal()
               ? this.$element.outerWidth
               : this.$element.outerHeight;

            //åˆ¤æ–­å­èŠ‚ç‚¹æ€»é«˜åº¦æ˜¯å¦å¤§äºŽçˆ¶èŠ‚ç‚¹é«˜åº¦, å¦åˆ™æ’ä»¶åœæ­¢è¿è¡Œ.
            if(totalSize < elmentTotalSize)return;

            //è®¾ç½®åŠ¨ç”»æ¸²æŸ“æ‰€éœ€çš„CSSæ ·å¼.
            this.$wrapper.css({
                 
                position : 'relative',
                overflow : 'hidden'

            });

            this.$element.css({

                 position : 'absolute',
                 top : 0,
                 left: 0

            });

            this.$element.css(this.isHorizontal() ? 'width' : 'height', '1000%');


            //å…‹éš†å­èŠ‚ç‚¹.
            this.cloneAllItems();

            //é¼ æ ‡ç›‘å¬
            if(this.settings.mouse)
                     this.addHoverEvent(this);

            this.timer(this);

            
       },

       /**
         * è®¡æ—¶å™¨.
         */
        timer : function(that){

            this.timeoutHandle = setTimeout(function(){that.play(that)}, this.settings.delay);

        },


        /**
         * æ’­æ”¾.
         */
        play : function(that){


           this.clearTimeout();

            var target = 0;

            for(var i = 0; i <= this.next; i++){
                 
                 target -= this.isHorizontal()
                    ? parseInt($(this.$items.get(this.next)).outerWidth())
                    : parseInt($(this.$items.get(this.next)).outerHeight());
                    

            }

            this.intervalHandle = setInterval(function(){that.animate(target)},this.settings.timing);
        },


        /**
         * åŠ¨ç”»æ¸²æŸ“.
         */
        animate : function(target){

            var mark = this.isHorizontal() ? 'left' : 'top';

            var present =  parseInt(this.$element.css(mark));

  
            if(present > target)
            {
                if(present - this.settings.speed <= target)
                {
                     this.$element.css(mark, target);
                
                }else

                     this.$element.css(mark, present - this.settings.speed);

            }else{


                this.clearInterval();

                if(this.next + 1 < this.$items.length){
                     
                     this.next++;
                    
                }else{

                    this.next = 0;
                    this.$element.css(mark,0);
                    
                }
                this.timer(this);
            }

        },


        isHorizontal : function(){

            return this.settings.direction == 'horizontal';
        },

        /**
         * å…‹éš†å­èŠ‚ç‚¹
         */
        cloneAllItems: function(){

            this.$element.append(this.$items.clone());
        },



        /**
         * å–æ¶ˆæ—¶é’Ÿé˜Ÿåˆ—.
         */
        clearTimeout : function(){
            
            clearTimeout(this.timeoutHandle);
        },

        /**
         * å–æ¶ˆå®šæ—¶å™¨é˜Ÿåˆ—.
         */
        clearInterval : function(){
            
            clearInterval(this.intervalHandle);
        },
        
        /**
         * æš‚åœåŠ¨ç”»æ¸²æŸ“.
         * @return {[type]} [description]
         */
        addHoverEvent : function(that){

            this.$wrapper
              .mouseenter(function(){
                   
                   that.clearInterval()
                   that.clearTimeout();

              })
              .mouseleave(function(){

                   that.play(that);

              });
        }



    }//prototype
    

    $.fn[pluginName] = function(options) {

        // chain jQuery functions
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Widget(this, options));
            }
        });

    };

})(jQuery, window, document);
