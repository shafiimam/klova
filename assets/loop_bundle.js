/*  Loop Subscription Bundle Snippet v2.7

Created and maintained by LOOP SUBSCRIPTIONS (https://apps.shopify.com/loop-subscriptions)
DO NOT modify source code of this file because
- It is an automatically generated file from LOOP SUBSCRIPTIONS backend.
- LOOP SUBSCRIPTIONS will keep releasing new versions of this file. You can check the latest version
  available by visiting Loop Admin > Bundles > Snippets > Install bundle snippet.
- Updating will replace the existing file implying that all the custom code on the existing file 
  (if any) will be lost. 
- If you need to make changes, please do it using our standard bundle style settings available inside each bundle details page on Loop admin portal.
If you need any help, please contact us at support@loopwork.co.
*/

const BUNDLE_LINK_PREFIX = "/a/loop_subscriptions/bundle";
const LOOP_BUNDLE_URL = "https://api-service.loopwork.co/bundleTransaction/getBundleCartDetails";
const LOOP_API_SERVICE_URL = "https://api-service.loopwork.co";
let BUNDLE_CONTAINER_CLASS = "BUNDLE_CONTAINER_CLASS";
let CART_SUBTOTAL_CLASS = "CART_SUBTOTAL_CLASS";

//dev
// const LOOP_BUNDLE_URL =
//   "https://dev-api-service.loopwork.co/bundleTransaction/getBundleCartDetails";
// const LOOP_API_SERVICE_URL = "https://dev-api-service.loopwork.co";

//prod
// const LOOP_BUNDLE_URL =
//   "https://api-service.loopwork.co/bundleTransaction/getBundleCartDetails";
// const LOOP_API_SERVICE_URL = "https://api-service.loopwork.co";

const getItemsHtml = (item, bundleQuantityMapping) => {
    let quantity = item.quantity;
    if (bundleQuantityMapping) {
        let variant = bundleQuantityMapping.find(
            (v) => v.childProductId === item.id
        );
        if (variant) {
            quantity = variant.quantity;
        }
    }
    return `<p><span style="display:block;" class="data-cart-item-selling-plan-name">${
        item.title || ""
    } x ${quantity || ""}</span></p>`;
};

const getBundleCartTableTemplate = (bundleItem, index, bundleLink) => {
    return `
        <tr class="cart-item" id="CartBundleItem-${index}">
    <td class="cart-item__media">
        <a href="${bundleLink}" class="cart-item__link" aria-hidden="true" tabindex="-1"> </a>
          <div class="cart-item__image-container gradient global-media-settings">
            <img src="${
                bundleItem.image || ""
            }"  class="cart-item__image" alt="" loading="lazy" width="150" height="94">
          </div>
    </td>

    <td class="cart-item__details"><a href="" class="cart-item__name h4 break">${
        bundleItem.label
    }</a>
                <div class="product-option">
            ${bundleItem.items.map((item) => getItemsHtml(item)).join("")}
              <br/>
        </div>
        <div class="product-option">
         ${bundleItem.price}
        </div><dl></dl>

        <p class="product-option">${
            bundleItem.sellingPlan || ""
        }</p><ul class="discounts list-unstyled" role="list" aria-label="Discount"></ul>
    </td>

    <td class="cart-item__totals right medium-hide large-up-hide">
      <div class="cart-item__price-wrapper">
        <span class="price price--end">
             ${bundleItem.price}
        </span>
      </div>
    </td>

    <td class="cart-item__quantity">
      <div class="cart-item__quantity-wrapper">
        <quantity-input class="quantity">
          <input disabled class="quantity__input" type="number" value="1" min="0">
        </quantity-input>
        <cart-remove-button>
          <a onclick="removeBundle('${
              bundleItem.bundleId
          }')" class="button button--tertiary" aria-label="${
        bundleItem.label
    }" style="cursor : pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" class="icon icon-remove">
                <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
                <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
            </svg>
          </a>
        </cart-remove-button>
      </div>
    </td>

    <td class="cart-item__totals right small-hide">
      <div class="cart-item__price-wrapper"><span class="price price--end">
           ${bundleItem.price}
          </span></div>
    </td>
  </tr>
    `;
};

const getBundleCartDrawerTemplate = (bundleItem, index, bundleLink) => {
    return `
        <tr class="cart-item" id="CartBundleItem-${index}">
          <td class="cart-item__media" style="text-align:center;">
            <img class="cart-item__image" 
              src="${bundleItem.image || ""}" 
              alt="${bundleItem.label}" loading="lazy" width="75" height="75">
          </td>
          <td class="cart-item__details">
            <a href="${bundleLink}" 
              class="cart-item__name break">
              ${bundleItem.label || ""}
            </a>
            <dl>
              <div class="product-option">
                ${bundleItem.items.map((item) => getItemsHtml(item)).join("")}
                  <br/>
                  <p><span class="data-cart-item-selling-plan-name">
                    ${bundleItem.sellingPlan || ""}
                  </span></p>
              </div>
            </dl>
          </td>
          <td class="cart-item__quantity small-hide">
            ${bundleItem.quantity}
          </td>
          <td class="right medium-hide large-up-hide">
            <div class="cart-item__price-wrapper medium-up" style="display: flex; gap: 10px;">
              <span class="price price--end" style="text-decoration:line-through;"> 
                ${bundleItem.priceWithoutDiscount} 
              </span>
              <span class="price price--end" style="font-weight: 600;">
                ${bundleItem.price} 
              </span>
            </div>
            <div onclick="removeBundle('${
                bundleItem.bundleId
            }')" style="cursor:pointer; width: fit-content;height: 15px;display: inline-flex;flex-direction: row-reverse;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style="width: 1em; height: 1em;" aria-hidden="true" focusable="false" role="presentation" class="icon icon-remove">
                    <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
                    <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
              </svg>
            </div>
          </td>
        </tr>
    `;
};

const getBundleCartItemsDivTemplate = (bundleItem, index, bundleLink) => {
    return `
        <div style="display:flex; gap:20px; justify-content: space-between;" id="CartBundleItem-${index}">
          <div style="display:flex; gap:20px;">
            <div style="text-align:center;">
              <img
                src="${bundleItem.image || ""}" 
                alt="${bundleItem.label}" loading="lazy" width="75" height="75">
            </div>
            <div>
              <a href="${bundleLink}" 
                 style="font-weight:600">
                ${bundleItem.label || ""}
              </a>
              <div>
                ${bundleItem.items.map((item) => getItemsHtml(item)).join("")}
                  <br/>
                  <p><span>${bundleItem.sellingPlan || ""}</span></p>
              </div>
            </div>
          </div>
          <div>
            ${bundleItem.quantity}
          </div>
          <div>
            <div style="display: flex; gap: 10px;">
              <span style="text-decoration:line-through;"> 
               ${bundleItem.priceWithoutDiscount}
              </span>
              <span style="font-weight: 600;">${bundleItem.price}</span>
            </div>
            <div onclick="removeBundle('${
                bundleItem.bundleId
            }')" style="cursor:pointer; vertical-align: text-top; width: fit-content;height: 15px;display: inline-flex;flex-direction: row-reverse;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style="width: 1em; height: 1em;" aria-hidden="true" focusable="false" role="presentation" class="icon icon-remove">
                    <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
                    <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
              </svg>
            </div>
          </div>
        </div>
    `;
};

const getPresetBundleCartTemplate = (bundleItem, index, bundleLink) => {
    return `
        <tr class="cart-item" id="CartBundleItem-${index}">
    <td class="cart-item__media">
        <a href="${bundleLink}" class="cart-item__link" aria-hidden="true" tabindex="-1"> </a>
          <div class="cart-item__image-container gradient global-media-settings">
            <img src="${
                bundleItem.image || ""
            }"  class="cart-item__image" alt="" loading="lazy" width="150" height="94">
          </div>
    </td>

    <td class="cart-item__details"><a href="${bundleLink}" class="cart-item__name h4 break">${
        bundleItem.label
    }</a>
        <div class="product-option">
            ${bundleItem.items
                .map((item) =>
                    getItemsHtml(item, bundleItem.bundleQuantityMapping)
                )
                .join("")}
              <br/>
        </div>
        <div class="product-option">
         ${bundleItem.eachBundleAmount}
        </div><dl></dl>

        <p class="product-option">${bundleItem.sellingPlan || ""}</p>
        ${
            bundleItem.discountTitle
                ? `<ul class="discounts list-unstyled" role="list" aria-label="Discount">
            <li class="discounts__discount">
                <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-discount color-foreground-text" viewBox="0 0 12 12">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0h3a2 2 0 012 2v3a1 1 0 01-.3.7l-6 6a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4l6-6A1 1 0 017 0zm2 2a1 1 0 102 0 1 1 0 00-2 0z" fill="currentColor">
                    </path>
                </svg>
                ${bundleItem.discountTitle}
            </li>
        </ul>`
                : ""
        }
    </td>

    <td class="cart-item__totals right medium-hide large-up-hide">
      <div class="cart-item__price-wrapper"><span class="price price--end">
           ${bundleItem.final_line_price}
          </span></div>
    </td>

    <td class="cart-item__quantity">
      <div class="cart-item__quantity-wrapper">
        <quantity-input class="quantity">
          <input disabled class="quantity__input" type="number" value="${
              bundleItem.bundleProductQuantity
          }" min="0">
        </quantity-input>
        <cart-remove-button>
          <a onclick="removeBundle('${
              bundleItem.bundleId
          }')" class="button button--tertiary" aria-label="${
        bundleItem.label
    }" style="cursor : pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" class="icon icon-remove">
                <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
                <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
            </svg>
          </a>
        </cart-remove-button>
      </div>
    </td>

    <td class="cart-item__totals right small-hide">
      <div class="cart-item__price-wrapper"><span class="price price--end">
           ${bundleItem.final_line_price_currency}
          </span></div>
    </td>
  </tr>
    `;
};

const getPresetBundleCartDrawerTemplate = (bundleItem, index, bundleLink) => {
    return `
        <tr class="cart-item" id="CartBundleItem-${index}">
    <td class="cart-item__media">
        <a href="${bundleLink}" class="cart-item__link" aria-hidden="true" tabindex="-1"> </a>
          <div class="cart-item__image-container gradient global-media-settings">
            <img src="${
                bundleItem.image || ""
            }"  class="cart-item__image" alt="" loading="lazy" width="150" height="94">
          </div>
    </td>

    <td class="cart-item__details"><a href="${bundleLink}" class="cart-item__name h4 break">${
        bundleItem.label
    }</a>
                <div class="product-option">
            ${bundleItem.items
                .map((item) =>
                    getItemsHtml(item, bundleItem.bundleQuantityMapping)
                )
                .join("")}
              <br/>
        </div>
        <div class="product-option">
         ${bundleItem.eachBundleAmount}
        </div><dl></dl>

        <p class="product-option">${bundleItem.sellingPlan || ""}</p>
        ${
            bundleItem.discountTitle
                ? `<ul class="discounts list-unstyled" role="list" aria-label="Discount">
            <li class="discounts__discount">
                <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-discount color-foreground-text" viewBox="0 0 12 12">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0h3a2 2 0 012 2v3a1 1 0 01-.3.7l-6 6a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4l6-6A1 1 0 017 0zm2 2a1 1 0 102 0 1 1 0 00-2 0z" fill="currentColor">
                    </path>
                </svg>
                ${bundleItem.discountTitle}
            </li>
        </ul>`
                : ""
        }
    </td>

    <td class="cart-item__totals right medium-hide large-up-hide">
      <div class="cart-item__price-wrapper"><span class="price price--end">
           ${bundleItem.final_line_price}
          </span></div>
    </td>

    <td class="cart-item__quantity">
      <div class="cart-item__quantity-wrapper">
        <quantity-input class="quantity">
          <input disabled class="quantity__input" type="number" value="${
              bundleItem.bundleProductQuantity
          }" min="0">
        </quantity-input>
        <cart-remove-button>
          <a onclick="removeBundle('${
              bundleItem.bundleId
          }')" class="button button--tertiary" aria-label="${
        bundleItem.label
    }" style="cursor : pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" class="icon icon-remove">
                <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
                <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
            </svg>
          </a>
        </cart-remove-button>
      </div>
    </td>

    <td class="cart-item__totals right small-hide">
      <div class="cart-item__price-wrapper"><span class="price price--end">
           ${bundleItem.final_line_price_currency}
          </span></div>
    </td>
  </tr>
    `;
};

// returns cart item key of a bundleId
const getItemKeysByBundleId = (bundleId) => {
    const cartItems = window.Loop.bundleCartAllItems;
    const data = {
        updates: {},
    };
    for (const item of cartItems) {
        const _bundleId =
            item?.properties?._bundleId ?? item?.properties?.bundleId;
        if (!_bundleId || _bundleId !== bundleId) continue;
        data.updates[item.key] = 0;
    }
    return data;
};

// removes a bundleId from cart
const removeBundle = async (bundleId) => {
    const data = getItemKeysByBundleId(bundleId);
    const endpoint = `${window.Shopify.routes.root}cart/update.js`;
    await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    window.location.href = window.location.href;
};

// returns variants and quantity of item from a bundle
const _getSelectedBundleVariants = (bundleId) => {
    const _allBundleCartItems = window.Loop.bundleCartAllItems;
    let _selectedVariants = "";
    let _selectedQuantities = "";
    for (const _item of _allBundleCartItems) {
        const _bundleId =
            _item?.properties?._bundleId ?? _item?.properties?.bundleId;
        if (!_bundleId || _bundleId !== bundleId) continue;
        _selectedVariants += `${_item.id},`;
        _selectedQuantities += `${_item.quantity},`;
    }
    return {
        selectedVariants: _selectedVariants.substring(
            0,
            _selectedVariants?.length - 1 //bcz we want to remove the last ","
        ),
        selectedQuantities: _selectedQuantities.substring(
            0,
            _selectedQuantities?.length - 1
        ),
    };
};

const _getLoopToken = async (shopifyDomain, bundleId) => {
    const _endpoint = `${LOOP_API_SERVICE_URL}/bundleTransaction/getToken?shopifyDomain=${shopifyDomain}&bundleTransactionId=${bundleId}`;
    const _response = await fetch(_endpoint);
    const _jsonRes = await _response.json();
    return _jsonRes?.token ?? "LOOP_TOKEN";
};

const editBundle = async (bundleId) => {
    console.log(`Editing bundle: ${bundleId}`);
    const { selectedVariants, selectedQuantities } = _getSelectedBundleVariants(
        bundleId
    );
    const _shopifyDomain = window?.Shopify?.shop;
    const _loopToken = await _getLoopToken(_shopifyDomain, bundleId);
    const _editBundleRef = `${BUNDLE_LINK_PREFIX}/change/${bundleId}?loop_token=${_loopToken}&selectedVariants=${selectedVariants}&selectedQuantities=${selectedQuantities}`;
    window.location.href = _editBundleRef;
};

const fetchBundleTransactionCartDetails = async (loopBundleGuid) => {
    const _endpoint = `${LOOP_BUNDLE_URL}/${loopBundleGuid}`;
    const _response = await fetch(_endpoint);
    return await _response.json();
};

const addExtraDetailsToBundleItems = async (bundleItems) => {
    let totalDiscount = 0;
    let currencySymbol = "";
    let currency = "";

    const fetchDetailsPromises = bundleItems.map((bundleItem) =>
        fetchBundleTransactionCartDetails(bundleItem.bundleId)
    );
    const allExtraDetails = await Promise.all(fetchDetailsPromises);
    for (let i = 0; i < allExtraDetails.length; ++i) {
        const extraDetails = allExtraDetails[i];
        const bundleItem = bundleItems[i];
        const quantityMapping =
            extraDetails?.variantMap?.[bundleItem.bundleId] ?? [];
        const isPresetBundleProduct = bundleItem.isPresetBundleProduct;
        const totalBundleItemsQuantity = bundleItem.items.reduce(
            (acc, item) => acc + item.quantity,
            0
        );
        let price = isPresetBundleProduct
            ? bundleItem.discounted_price
            : bundleItem.price;

        bundleItem.label = extraDetails?.label;
        bundleItem.image = extraDetails?.image;
        bundleItem.sellingPlan = extraDetails?.name;
        bundleItem.priceWithoutDiscount = `${
            extraDetails.currencySymbol
        }${price.toFixed(2)}`;
        bundleItem.final_line_price_currency = `${
            extraDetails.currencySymbol
        }${parseFloat(bundleItem.final_line_price).toFixed(2)}`;
        bundleItem.loopBundleId = extraDetails.loopBundleId;
        currencySymbol = extraDetails.currencySymbol;
        currency = extraDetails.currency;

        if (
            extraDetails.discountType &&
            extraDetails.discountValue &&
            !isPresetBundleProduct
        ) {
            if (extraDetails.discountType === "PERCENTAGE") {
                if (extraDetails.appliesOnEachItem) {
                    // if discount in each item
                    totalDiscount +=
                        price *
                        (parseFloat(extraDetails.discountValue) / 100) *
                        totalBundleItemsQuantity;
                    price =
                        price -
                        price *
                            (parseFloat(extraDetails.discountValue) / 100) *
                            totalBundleItemsQuantity;
                } else {
                    totalDiscount +=
                        price * (parseFloat(extraDetails.discountValue) / 100);
                    price =
                        price -
                        price * (parseFloat(extraDetails.discountValue) / 100);
                }
            } else {
                if (extraDetails.appliesOnEachItem) {
                    // if discount in each item
                    totalDiscount +=
                        parseFloat(extraDetails.discountValue) *
                        totalBundleItemsQuantity;
                    price =
                        price -
                        parseFloat(extraDetails.discountValue) *
                            totalBundleItemsQuantity;
                } else {
                    totalDiscount += parseFloat(extraDetails.discountValue);
                    price = price - parseFloat(extraDetails.discountValue);
                }
            }
        }

        bundleItem.price = `${extraDetails.currencySymbol}${parseFloat(
            price
        ).toFixed(2)}`;

        if (extraDetails?.productsQuantity) {
            bundleItems[i]["bundleProductQuantity"] =
                extraDetails.productsQuantity;
            bundleItems[i]["eachBundleAmount"] = `${
                extraDetails.currencySymbol
            }${parseFloat(
                bundleItems[i].final_line_price / extraDetails.productsQuantity
            ).toFixed(2)}`;
        } else {
            bundleItems[i]["bundleProductQuantity"] = 1;
            bundleItems[i]["eachBundleAmount"] = `${
                extraDetails.currencySymbol
            }${parseFloat(price / 1).toFixed(2)}`;
        }
        if (quantityMapping.length) {
            bundleItem.bundleQuantityMapping = quantityMapping;
        }
        if (isPresetBundleProduct) {
            bundleItem.productHandle = extraDetails.product_handle;
        }
    }

    removeDiscountFromSubtotalInCart(totalDiscount, currencySymbol, currency);
};

const removeDiscountFromSubtotalInCart = (
    totalDiscount,
    currencySymbol,
    currency
) => {
    let targetNode = null;
    targetNode = document.querySelector(`.totals__subtotal-value`);
    if (targetNode) {
        applyDiscountByCartLineItems(
            targetNode,
            totalDiscount,
            currencySymbol,
            currency
        );
    }
};

function applyDiscountByCartLineItems(
    element,
    discount,
    currencySymbol,
    currency
) {
    const totalLineItemsPrice = window.Loop.bundleCartAllItems.reduce(
        (acc, item) => {
            return (
                acc +
                (item.properties._isPresetBundleProduct
                    ? item.discounted_price
                    : item.price) *
                    item.quantity
            );
        },
        0
    );
    const discountedPrice = (
        (totalLineItemsPrice / 100).toFixed(2) - discount
    ).toFixed(2);

    if (!isNaN(discountedPrice)) {
        element.innerHTML = `${currencySymbol ?? ""}${discountedPrice} ${
            currency ?? ""
        }`;
    }
}

const getBundleItems = (items) => {
    const bundleItemsMap = {};
    for (const item of items) {
        const bundleId =
            item?.properties?._bundleId ?? item?.properties?.bundleId;
        if (!bundleId) continue;
        if (!Object.hasOwn(bundleItemsMap, bundleId)) {
            bundleItemsMap[bundleId] = {
                bundleId,
                quantity: 1,
                price: (Number(item.price) * Number(item.quantity)) / 100,
                amount: (Number(item.price) * Number(item.quantity)) / 100,
                items: [item],
                discounted_price:
                    (Number(item.discounted_price) * Number(item.quantity)) /
                    100,
                isPresetBundleProduct: item?.properties?._isPresetBundleProduct,
                discountTitle: item?.discounts?.[0]?.title ?? "",
                final_line_price: Number(item.final_line_price) / 100,
            };
        } else {
            bundleItemsMap[bundleId].price +=
                (Number(item.price) * Number(item.quantity)) / 100;
            bundleItemsMap[bundleId].discounted_price +=
                (Number(item.discounted_price) * Number(item.quantity)) / 100;
            bundleItemsMap[bundleId].amount +=
                (Number(item.price) * Number(item.quantity)) / 100;
            bundleItemsMap[bundleId].final_line_price +=
                Number(item.final_line_price) / 100;
            bundleItemsMap[bundleId].items.push(item);
        }
    }
    return sortItemsByTitle(Object.values(bundleItemsMap));
};

const sortItemsByTitle = (bundles) => {
    return bundles.map((bundle) => {
        bundle.items.sort((a, b) => {
            let titleA = a.title.toUpperCase();
            let titleB = b.title.toUpperCase();
            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }
            return 0;
        });
        return bundle;
    });
};

const renderBundleItems = (bundleItems, clientId) => {
    let _parent = document.querySelector(`.${clientId}`);
    if (!_parent) {
        _parent = document.querySelector(`.${BUNDLE_CONTAINER_CLASS}`);
    }
    if (!_parent) {
        return;
    }

    for (let i = 0; i < bundleItems.length; ++i) {
        let bundleItem = bundleItems[i];
        const _bundleLink = bundleItem.isPresetBundleProduct
            ? `https://${window.Shopify.shop}/products/${bundleItem.productHandle}`
            : `${BUNDLE_LINK_PREFIX}/${bundleItem.loopBundleId}`;
        let _template = undefined;
        let hasTable = document.getElementsByTagName("table");

        if (
            bundleItem["isPresetBundleProduct"] &&
            window.location.pathname === "/cart"
        ) {
            _template = getPresetBundleCartTemplate(
                bundleItem,
                i + 1,
                _bundleLink
            );
        } else if (
            bundleItem["isPresetBundleProduct"] &&
            window.location.pathname !== "/cart"
        ) {
            _template = getPresetBundleCartDrawerTemplate(
                bundleItem,
                i + 1,
                _bundleLink
            );
        } else if (clientId.includes("drawer") && hasTable.length) {
            _template = getBundleCartDrawerTemplate(
                bundleItem,
                i + 1,
                _bundleLink
            );
        } else if (hasTable.length) {
            _template = getBundleCartTableTemplate(
                bundleItem,
                i + 1,
                _bundleLink
            );
        } else {
            _template = getBundleCartItemsDivTemplate(
                bundleItem,
                i + 1,
                _bundleLink
            );
        }
        _parent.innerHTML = `${_template} ${_parent.innerHTML}`;
    }
};

async function getCartItems() {
    const url = `https://${Shopify.cdnHost.split("/cdn")[0]}/cart.json`;
    const res = await (await fetch(url)).json();
    return res?.items ?? [];
}

function setupMutationNew() {
    if (window.location.pathname.includes("/a/loop_subscriptions/bundle")) {
        return;
    }

    let previousQuantity = window.Loop.bundleCartAllItems.reduce(
        (acc, curr) => acc + curr.quantity,
        0
    );
    let timeoutId;
    const handleChanges = async () => {
        const res = await getCartItems();
        let currenctQuantity = res.reduce(
            (acc, curr) => acc + curr.quantity,
            0
        );
        if (currenctQuantity !== previousQuantity) {
            window.location.reload();
        }
    };

    let targetNodes = document.querySelectorAll("form");
    const config = { childList: true, subtree: true };

    targetNodes.forEach((targetNode) => {
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleChanges, 500);
        });
        observer.observe(targetNode, config);
    });
}

function setupMutationIfElementDelete() {
    let firstChange = true;
    let timeoutId;
    const handleChanges = () => {
        if (firstChange) {
            firstChange = false;
        } else {
            if (
                !window.location.pathname.includes(
                    "/a/loop_subscriptions/bundle"
                )
            ) {
                firstChange = true;
                window.location.reload();
            }
        }
    };

    let targetNode = document.querySelector(".cart-container");
    if (!targetNode) {
        targetNode = document.querySelector(".cart__blocks");
    }
    if (!targetNode) {
        return;
    }

    const observer = new MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleChanges, 1000);
    });
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
}

function setupMutation() {
    var firstChange = true;
    let targetNode = null;
    let observerNode = null;
    targetNode = document.querySelectorAll(`[data-cart-subtotal]`);
    if ((targetNode && targetNode.length > 1) || !targetNode.length) {
        observerNode = document.querySelector(`.${CART_SUBTOTAL_CLASS}`);
    } else {
        observerNode = targetNode[0];
    }

    if (!observerNode) {
        return;
    }

    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
        if (firstChange) {
            firstChange = false;
            return;
        } else {
            firstChange = true;
            setTimeout(window.location.reload(), 1000);
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(observerNode, config);
}

const bootstrap = async (clientId) => {
    console.log(`Loop Bundle Initialized for ${clientId}`);

    try {
        let response = await fetch(
            `https://snippets.loopwork.co/bundle/${Shopify.shop}/${Shopify.theme.id}.json`
        );

        let data = (await response.json()) || {};
        // console.log("data", data);
        if (Object.keys(data).length) {
            BUNDLE_CONTAINER_CLASS = data.cartContainerClass;
            CART_SUBTOTAL_CLASS = data.cartSubtotalClass;
        }
    } catch (error) {
        console.log("Error fetching loop bundle classes");
    }

    const _cartItems = window.Loop.bundleCartAllItems;
    const _bundleItems = getBundleItems(_cartItems);
    await addExtraDetailsToBundleItems(_bundleItems);
    if (_bundleItems?.length) {
        setupMutationNew();
        // setupMutation();
        // setupMutationIfElementDelete();
    }
    renderBundleItems(_bundleItems, clientId);
};
