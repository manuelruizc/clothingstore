// Put your applicaiton javascript here



$(document).ready(function() {
    const cartcount = document.getElementById("cart-count-nav");
    const cartfixed = document.getElementById("cart-count-fix");
    const popup = $("#popup");

    function getCartData(show = false) {
        const cartContainer = $("#cartContainer");
    
        axios.get('/cart.js')
        .then(function(response) {
            let subtotal = 0.0;
            const { data } = response;
            const { items } = data;
            const price = document.getElementById("cart-price-container");
            const cartDivContainer = document.getElementById("products-fx");
            let html = "";
            if(items.length === 0)
                html = "<span><b>Sigue comprando</b></span>";
            else {
                items.forEach(item => {
                    subtotal += item.final_line_price / 100.00;
                    html += "<div class='product-container-cart'>"
                        html += `<img src="${item.image}">`
                        html += `<div class="containers-container">`;
                            html += `<div class="cart-first-container">
                                        <span class="title">${item.title}</span>
                                        <a href="javascript:void(0)" class="sub-item" data-quantity="1" data-variant="${item.variant_id}">Quitar</a>
                                    </div>`;
                            if(item.discounts.length === 0) {
                                html += `<div class="cart-second-container">
                                            <span class="price">$${item.price / 100.00}</span>
                                        </div>`;
                            }
                            else {
                                html += `<div class="cart-second-container">
                                            <span class="price"><span class="tagged">$${item.original_price / 100.00}</span> $${item.final_price / 100.00}</span>
                                        </div>`;
                            }
                            html += `<div class="cart-third-container">
                                        <div>
                                            <a data-quantity="${item.quantity}" data-variant="${item.variant_id}" class="sub-item" href="javascript:void(0)">-</a>
                                            <span>${item.quantity}</span>
                                            <a data-quantity="${item.quantity}" data-variant="${item.variant_id}" class="add-item" href="javascript:void(0)">+</a></div>
                                    </div>`;
                        html += `</div>`;
                    html += "</div>"
                });
            }
    
            cartDivContainer.innerHTML = html;
            price.innerHTML = `<h2>SUBTOTAL</h2><h2>$${subtotal.toFixed(2)}</h2>`
            cartcount.innerText = data.item_count;
            cartfixed.innerText = data.item_count;
            


            // popup.addClass("show-popup");

            if(show)
                show_cart();
    
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    

    let page_url = window.location.href;
    page_url = page_url.substring(page_url.length-11, page_url.length);
    
    
    if(page_url === "cart_open=1") {
        getCartData(true);
    }
    else {
        getCartData();
    }
    

    $("#quit-popup, .popup-quit-btn").on("click", function() {
        popup.removeClass("show-popup");
    });

    $('.thumbnail-link').on('click', function(e) {
        e.preventDefault();
        const thumbnail = $(this)[0];
        $(this).addClass("thumbnail-selected").siblings().removeClass("thumbnail-selected");
        const mainPhoto = $("#ProductPhotoImg");
        mainPhoto.attr('src', thumbnail.dataset.src);
        mainPhoto.attr('srcset', thumbnail.dataset.src);
    });

    $("body").on("click", ".sub-item, .add-item", function() {
        const self = $(this)[0];
        const { className, dataset } = self;
        const operation = className.substring(0, 3);
        const { quantity, variant } = dataset;
        const new_quantity = operation === "sub" ? Number(quantity) - 1 : Number(quantity) + 1;
        change_quantity(variant, new_quantity);
    });

    function change_quantity(id, quantity) {
        axios.post('/cart/change.js', {
            quantity,
            id: id,
        })
        .then(function(response) {
            getCartData();
        })
        .catch(function(error) {
            console.log(error);
        });
    }


    // Add to Cart
    function add_to_cart(id) {
        axios.post('/cart/add.js', {
            quantity: 1,
            id: Number(id),
        })
        .then(function(response) {
            getCartData(true);
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    $(".add-to-cart-anchor").on("click", function() {
        const { id } = this.dataset;
        add_to_cart(id);
    });

    $("#AddToCartForm").on("submit", function(e) {
        e.preventDefault();
        const quantity = $("#Quantity").val();
        const id = $("#productSelect").val();

        const cartContainer = $("#cartContainer");

        axios.post('/cart/add.js', {
            quantity,
            id,
        })
        .then(function (response) {
            getCartData(true);
            cartContainer.addClass("cart-visible");
        })
        .catch(function (error) {
            console.log(error);
        });
    });


    function exit_cart() {
        const cartContainer = $(".cart-container");
        const exitContainer = $("#exit-cart");
        const background = $("#cartContainer");
        background.removeClass("cart-visible-background").removeClass("pointer-events");
        cartContainer.removeClass("cart-visible");
        exitContainer.removeClass("cart-visible");
        $("body").removeClass("hidden-overflow");
    }

    function show_cart() {
        const cartContainer = $(".cart-container");
        const exitContainer = $("#exit-cart");
        const background = $("#cartContainer");
        background.addClass("cart-visible-background").addClass("pointer-events");
        cartContainer.addClass("cart-visible");
        exitContainer.addClass("cart-visible");
        $("body").addClass("hidden-overflow");
    }

    $("#exit-cart, #close-cart").on("click", function(e) {
        e.preventDefault();
        exit_cart();
    });
    
    $("#carrito").on("click", function(e) {
        e.preventDefault();
        show_cart();
    });

    $(".scroll-to-left").on("click", function() {
        $('.related-products-slider').animate({
            scrollLeft: `-=${$(".related-products-slider")[0].clientWidth}`
        }, 700);
    });
    
    $(".scroll-to-right").on("click", function() {
        $('.related-products-slider').animate({
            scrollLeft: `+=${$(".related-products-slider")[0].clientWidth}`
        }, 700);
    });


    $("#menu-burger").on("click", function() {
        $(".mobile-nav").toggleClass("mobile-nav-active");
        $(".menu-burger").toggleClass("active-burger");
        $(".nav-container").toggleClass("active-burger-parent");
    });

    $(".mobile-nav button").on("click", function() {
        $(".mobile-nav").removeClass("mobile-nav-active");
        $(".menu-burger").removeClass("active-burger");
        $(".nav-container").removeClass("active-burger-parent");
    });

    // $(".product-option").on("change", function(e) {
    //     e.preventDefault();

    //     var optionSelected = $("option:selected", this);
    //     var valueSelected = this.value;
    // });


    $(".arrow-left").on("click", function(e) {
        e.preventDefault();
        $('.store-carousel-container').animate({
            scrollLeft: `-=${$(".store-carousel-container")[0].clientWidth}`
        }, 700);
    });

    $(".arrow-right").on("click", function(e) {
        e.preventDefault();
        $('.store-carousel-container').animate({
            scrollLeft: `+=${$(".store-carousel-container")[0].clientWidth}`
        }, 700);
    });







    document.getElementsByTagName("body")[0].onscroll = () => {
        const windowWidth = window.screen.width;
        const nav = windowWidth < 600 ? document.getElementById("anchor-title") : document.getElementsByTagName("nav")[0];
        const navHeight = windowWidth < 600 ? nav.clientHeight : nav.clientHeight;
        const { top } = nav.getBoundingClientRect();
        const letters = document.getElementsByClassName("letter");
        const logoLetters = ["c", "a", "m", "w", "o"];
        for(let i = 0; i < logoLetters.length; i++) {
            const currentLetter = letters[i];
            const currentLetterClass = `scrolled-letter-${logoLetters[i]}`;
            const classExists = currentLetter.classList.contains(currentLetterClass);
            if(!classExists && top <= navHeight)
                currentLetter.classList.add(currentLetterClass);
            else if(classExists && top > navHeight)
                currentLetter.classList.remove(currentLetterClass);
        }
    }













//     imageZoom("ProductPhotoImg", "img-result"); 


//     function moveOut() {
//         $(".img-zoom-lens").removeClass("opacity-one");
//     }
    
//     function moveIn() {
//         $(".img-zoom-lens").addClass("opacity-one")
//     }



//     $("#ProductPhotoImg").on("mouseenter", moveIn);
//     $("#ProductPhotoImg").on("mouseout", moveOut);
//     function imageZoom(imgID, resultID) {
//         var img, lens, result, cx, cy;
//         img = document.getElementById(imgID);
//         result = document.getElementById(resultID);
//         console.log("FEDERERERERERERERERe", result);
//         /*create lens:*/
//         lens = document.createElement("DIV");
//         lens.setAttribute("class", "img-zoom-lens");
//         /*insert lens:*/
//         img.parentElement.insertBefore(lens, img);
//         /*calculate the ratio between result DIV and lens:*/
//          console.log("result.offsetWidth  >>>>>", result.offsetWidth ,"lens.offsetWidth>>>>>>>>>>>",lens.offsetWidth);
//         cx = 300 / lens.offsetWidth;
//       console.log("result.offsetHeight>>>>>",result.offsetHeight ,"llens.offsetHeighth>>>>>>>>>>>",lens.offsetHeight);
//       cy = 300 / lens.offsetHeight;
//       /*set background properties for the result DIV:*/
//       result.style.backgroundImage = "url('" + img.srcset + "')";
//       result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
//       /*execute a function when someone moves the cursor over the image, or the lens:*/
//       lens.addEventListener("mousemove", moveLens);
//       img.addEventListener("mousemove", moveLens);
//       /*and also for touch screens:*/
//       lens.addEventListener("touchmove", moveLens);
//       img.addEventListener("touchmove", moveLens);
//       // img.addEventListener("mouseenter", bigImg);  
     
      
      
//       function bigImg(x) {
//         console.log("onmouseenter >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//     }
    
//     function normalImg(x) {
//         //result.style.display ="none";
//          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>onmousLEAVE");
//     }
    
    
      
//       function moveLens(e) {
//         var pos, x, y;
//         /*prevent any other actions that may occur when moving over the image:*/
//         e.preventDefault();
//         /*get the cursor's x and y positions:*/
//         pos = getCursorPos(e);
//         /*calculate the position of the lens:*/
//         x = pos.x - (lens.offsetWidth / 2);
//         y = pos.y - (lens.offsetHeight / 2);
//       // console.log("x" , x , "and Y " , y); 
//         /*prevent the lens from being positioned outside the image:*/
//         if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;  } //else{img.addEventListener("mouseenter", bigImg);  }
//         if (x < 0) {x = 0;}
//         if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight; img.addEventListener("mouseleave",  normalImg);}//else{img.addEventListener("mouseenter", bigImg);  }
//         if (y < 0) {y = 0;}
//         /*set the position of the lens:*/
//         lens.style.left = (x) + "px";
//         lens.style.top = y + "px";
//         /*display what the lens "sees":*/
//         result.style.backgroundPosition = "-" + ((x) * cx) + "px -" + (y * cy) + "px";
//       }

//       function getCursorPos(e) {
//         var a, x = 0, y = 0;
//         e = e || window.event;
//         /*get the x and y positions of the image:*/
//         a = img.getBoundingClientRect();
//         //console.log("------------------A  left" ,  a ); 
//         /*calculate the cursor's x and y coordinates, relative to the image:*/
//         x = e.pageX - a.left;
//         y = e.pageY - a.top;
//         /*consider any page scrolling:*/
//         x = x - window.pageXOffset;
//         y = y - window.pageYOffset;
//         return {x : x, y : y};
//       }
      
//     }
});