import { LitElement, html, css } from 'https://cdn.skypack.dev/lit@2.2.8';

const skioStyles = css`

  .hide {
    display: none !important;
  }

  .skio-plan-picker {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;
    border: 0;
    margin-bottom: 24px;
  }
  .skio-onetime-second {
    order: 2;
  }
  
  .skio-group-container {
    display: none;
  }
  .skio-group-container--available {
    display: block;
    position: relative;
    box-shadow: 0 0 5px rgba(23, 24, 24, 0.05), 0 1px 2px rgba(0, 0, 0, 0.07);
    border-radius: 5px;
    border-width: 2px;
    border-color: transparent;
    border-style: solid; 
    transition: border-color 0.2s ease;
  }
  .skio-group-container--selected {
    border-color: #000;
  }

  .skio-price {
    margin-left: 10px;
  }
  
  .skio-group-input {
    position: absolute;
    width: 0px;
    height: 0px;
    opacity: 0;
  }
  .skio-group-input:focus-visible ~ .skio-group-label {
    outline: 2px #ccc solid;
    outline-offset: 4px;
    border-radius: 5px;
  }
  
  .skio-group-label {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    
    padding: 10px 20px!important;

    overflow: hidden;

    min-height: 48px;
    justify-content: center;

  }
  
  .skio-group-topline {
    display: flex;
    /*flex-wrap: wrap;*/
    align-items: center;
    width: 100%;
    font-size: 16px;

    font-family: 'Bergen Sans';
    font-weight: 600;


  }
  
  .skio-radio__container {
    display: flex;
    margin-right: 20px;
  }
  
  .skio-radio {
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1);
    transform-origin: center;
    transform: scale(0);
    opacity: 0;
  }
  .skio-group-label:hover .skio-radio {
    transform: scale(1);
    opacity: 0.75;
  }
  .skio-group-container--selected .skio-group-label .skio-radio {
    transform: scale(1);
    opacity: 1;
  }
  
  .skio-group-content {
    width: auto;
    transition: max-height 0.25s cubic-bezier(0.4,0,0.2,1),
                opacity 0.25s cubic-bezier(0.4,0,0.2,1);
    max-height: 28px;
    opacity: 1;
  }

  .skio-group-content.collapse {
    max-height: 0px;
    opacity: 0;
  }

  .skio-frequency-one {
    font-size: 1rem;
    font-weight: 600;
    font-family: 'Bergen Sans';
  }
  
  /* Hide frequency if not selected */
  .skio-group-container:not(.skio-group-container--selected) .skio-group-content {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
  }
  
  .skio-group-title {
    /*min-width: max-content;*/
  }
  
  .skio-save {
    color: #0fa573;
    border: 1px #0fa573 solid; 
    padding: 0px 8px;
    border-radius: 20px;
    padding-top: 3px;
    white-space: nowrap;
  }
  
  .skio-frequency {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 30px 8px 10px;
    margin-top: 5px;
    border-radius: 5px;
    background-color: #f7f7f7;
    width: 100%;
    border: 0;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
    background-position: right 10px top 50%;
    background-size: 18px;
    background-repeat: no-repeat;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  .skio-frequency.skio-frequency--one {
    background-image: none;
  }
  
  .skio-frequency span {
    text-transform: lowercase;
  }
`;

export class SkioPlanPickerComponent extends LitElement {
  static properties = {
    product: { type: Object },
    productHandle: { type: String },
    selectedVariant: { type: Object },
    key: { type: String },
    formId: { type: String },
    
    skioSellingPlanGroups: {},
    availableSellingPlanGroups: {},

    selectedSellingPlanGroup: {},
    selectedSellingPlan: {},

    subscriptionFirst: { type: Boolean },
    startSubscription: { type: Boolean },

    discount_format: { type: String },

    moneyFormatter: {},

    currency: { type: String }
  };

  static styles = skioStyles;

  constructor() {
    super();
    // Define reactive properties--updating a reactive property causes the component to update.
    this.product = null;
    this.selectedVariant = null;

    this.productHandle = null;

    this.key = null;
    this.formId = null;

    this.skioSellingPlanGroups = null;
    this.availableSellingPlanGroups = null;

    this.selectedSellingPlanGroup = null;
    this.selectedSellingPlan = null;

    this.startSubscription = false;
    this.subscriptionFirst = false;

    this.skioMainProduct = true;

    this.discountFormat = 'percent';

    this.currency = 'USD';
    this.moneyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    });
  }

  connectedCallback() {
    super.connectedCallback();

    const vm = this;

    if(!this.product && this.productHandle) {
      this.fetchProduct(this.productHandle);
    }

    if (document.querySelectorAll(".main-product__content").length > 0) {
      let rechargeObserver = 
        new MutationObserver(function(mutationsList, observer) {
          for(const mutation of mutationsList) {
            document.querySelectorAll(".rc-container-wrapper").forEach((el) => el.remove())
            document.querySelectorAll(".recharge-subscription-widget").forEach((el) => el.remove())
          }
        }).observe(document.querySelector(".main-product__content"), { childList: true, subtree: true });
    }

    document.addEventListener("variantChanged", function() {
      if (vm.formId) {
        let form = document.querySelector("#" + vm.formId);
        if (form) {
          let variant_id = form.querySelector('[name="id"]').value;
          vm.selectedVariant = vm.product.variants.find(x => x.id == variant_id);
        }
      }

    });

  }

  render() {
    if(!this.product || !this.selectedVariant || this.skioSellingPlanGroups?.length == 0) return;
    
    return html`
      <fieldset class="skio-plan-picker" skio-plan-picker="${ this.key }">
        <input name="selling_plan" type="hidden" value="${ this.selectedSellingPlan !== null ? this.selectedSellingPlan?.id : ''}" />
        <input name="properties[Discount]" type="hidden" value="${ this.selectedSellingPlan !== null ? this.discount(this.selectedSellingPlan).percent : '' }" 
          ?disabled="${ this.selectedSellingPlan == null ? true : false }" />
        
        <div class="skio-group-container ${ this.product.requires_selling_plan == false ? 'skio-group-container--available' : '' } ${ this.selectedSellingPlanGroup == null ? 'skio-group-container--selected' : '' } ${ this.subscriptionFirst ? 'skio-onetime-second' : ''} ${ this.product.handle == 'extra-strength-sleep-patch-subscription' ? 'hide' : '' }" skio-group-container 
          @click=${() => this.selectSellingPlanGroup(null) } >
        
          <input id="skio-one-time-${ this.key }" class="skio-group-input" name="skio-group-${ this.key }" type="radio" value="" 
            skio-one-time ?checked=${ this.startOnetime == true && this.product.requires_selling_plan == false ? true : false }>
          <label class="skio-group-label" for="skio-one-time-${ this.key }">
            <div class="skio-group-topline">
              <div class="skio-radio__container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                  <circle class="skio-radio" cx="12" cy="12" r="7" fill="currentColor"></circle>
                </svg>
              </div>
              One-time purchase 
              <div class="skio-price">
                <span skio-onetime-price>${ this.moneyFormatter.format(this.selectedVariant.price / 100) }</span>
              </div>
            </div>
          </label>
        </div>
        ${ this.availableSellingPlanGroups ? this.availableSellingPlanGroups.map((group, index) => 
          html`
            <div class="skio-group-container skio-group-container--available ${ this.selectedSellingPlanGroup == group ? 'skio-group-container--selected' : '' } ${ this.product.handle == 'extra-strength-sleep-patch-subscription' ? 'hide' : '' }" skio-group-container
              @click=${() => this.selectSellingPlanGroup(group) }>
              <input id="skio-selling-plan-group-${ index }-${ this.key }" class="skio-group-input" name="skio-group-${ this.key }"
                type="radio" value="${ group.id }" skio-selling-plan-group="${ group.id }" ?checked=${ this.selectedSellingPlanGroup == group ? true : false } >
              <label class="skio-group-label" for="skio-selling-plan-group-${ index }-${ this.key }">
                <div class="skio-group-topline">
                  <div class="skio-radio__container">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                      <circle class="skio-radio" cx="12" cy="12" r="7" fill="currentColor"></circle>
                    </svg>
                  </div>
                  <div class="skio-group-title">
                    ${ group.name }
                    ${ this.discount(group.selected_selling_plan).percent !== '0%' ? html`
                      <span class="skio-save">Save <span skio-discount>${ this.discountFormat == 'percent' ? this.discount(group.selected_selling_plan).percent : this.discount(group.selected_selling_plan).amount }</span></span>
                    ` : html`` }
                  </div>
                  <div class="skio-price">
                    <span skio-subscription-price>${ this.price(group.selected_selling_plan) }</span>
                  </div>
                </div>
                
              </label>
            </div>
            <div class="skio-group-content ${ this.selectedSellingPlanGroup == group ? '' : 'collapse' }">
            
              <select skio-selling-plans="${ group.id }" class="skio-frequency ${ group.selling_plans.length == 1 ? 'hide' : '' }"
                @change=${ (e) => this.selectSellingPlan(e.target, group) }>
                ${ group ? group.selling_plans.map((selling_plan) => 
                    html`
                    <option value="${ selling_plan.id }">
                      ${ group.name == 'Subscription' ? `Delivery ${ selling_plan.name.toLowerCase() }` : `${ selling_plan.name.toLowerCase() }` }
                    </option>
                    `
                  ): ''}
              </select>

              ${ group.selling_plans.length == 1 ? 
                html`
                  <span class="skio-frequency-one">Delivery ${ group.selling_plans[0].name.toLowerCase() }</span>
                ` 
                : ''}

            </div>
          `
        ): ''}
      </fieldset>`
  }

  updated = (changed) => {
    if(changed.has('product') && this.product) {
      //update key
      this.key = this.key ? this.key : this.product.id;

      //update skioSellingPlanGroups
      this.skioSellingPlanGroups = this.product.selling_plan_groups.filter(
        selling_plan_group => selling_plan_group.app_id === 'SKIO'
      )

    }

    if(changed.has('selectedVariant') && this.selectedVariant) {
      //update availableSellingPlanGroups based on skioSellingPlanGroups and selectedVariant.id
      this.availableSellingPlanGroups = this.skioSellingPlanGroups.filter(selling_plan_group =>
        selling_plan_group.selling_plans.some(selling_plan =>
          this.selectedVariant.selling_plan_allocations.some(
            selling_plan_allocation => selling_plan_allocation.selling_plan_id === selling_plan.id
          )
        )
      )

      //update selectedSellingPlan value
      if (this.availableSellingPlanGroups.length) {
        //update each group with a default selected_selling_plan
        this.availableSellingPlanGroups.forEach((group => {
          group.selected_selling_plan = group.selling_plans[0];
        }));

        if (this.startOnetime == false || this.product.requires_selling_plan == true) {
          this.selectedSellingPlanGroup = this.availableSellingPlanGroups[0];
          this.selectedSellingPlan = this.availableSellingPlanGroups[0].selling_plans[0];
        }
      }

      this.updateForm();
    }

    if(changed.has('selectedSellingPlan')) {
      //update price of price elements if applicable
      document.querySelectorAll(`[skio-price][skio-key="${ this.key }"]`).forEach((el) => {
        el.parentNode.removeAttribute('data-price-mutation-watcher');
        el.classList.remove('recharge-inner-most-price');
        el.innerHTML = this.price(this.selectedSellingPlan);
      });

      //update display of external content elements
      document.querySelectorAll(`[skio-onetime-content][skio-key="${ this.key }"]`).forEach((el) => {
        this.selectedSellingPlan !== null ? el.style.display = "none" : el.style.removeProperty('display');
      });

      document.querySelectorAll(`[skio-subscription-content][skio-key="${ this.key }"]`).forEach((el) => {
        this.selectedSellingPlan == null ? el.style.display = "none" : el.style.removeProperty('display');
      });

      //dispatch CustomEvent to tell that this specific plan picker was updated, and pass the selectedSellingPlan
      const event = new CustomEvent(`skio::update-selling-plan`, {
        bubbles: true, 
        composed: true, 
        detail: {
          sellingPlan: this.selectedSellingPlan,
          key: this.key
        }
      });

      this.dispatchEvent(event);

      this.updateForm();


    }
  }

  log = (...args) => {
    args.unshift('%c[skio]', 'color: #8770f2;');
    console.log.apply(console, args);
  }

  error = (...args) =>  {
    args.unshift('%c [skio]', 'color: #ff0000');
    console.error.apply(console, args);
  }
  
  // Update selected selling plan group; called on click of skio-group-container element
  selectSellingPlanGroup(group) {
    this.selectedSellingPlanGroup = group;
    this.selectedSellingPlan = group?.selected_selling_plan;

    //update the form that was passed, if any
    this.updateForm();
  }

  // Update selected selling plan; called on change of skio-frequency select element
  selectSellingPlan(element, group) {
    let selling_plan = group.selling_plans.find(x => x.id == element.value);
    if (selling_plan) {
      group.selected_selling_plan = selling_plan;
      this.selectedSellingPlanGroup = group;
      this.selectedSellingPlan = selling_plan;
    }
    else this.log("Error: couldn't find selling plan with id " + element.value + " for variant " + this.selectedVariant.id + " from product " + this.product.id + " : " + this.product.handle);
  }

  // Formats integer value into money value
  money(price) {
    return this.moneyFormatter.format(price / 100.0)
  }

  // Calculates discount based on selling_plan.price_adjustments, returns { percent, amount } of selling plan discount
  discount(selling_plan) {
    if (!selling_plan)
      return { percent: '0%', amount: 0 }
    
    const price_adjustment = selling_plan.price_adjustments[0]
    const discount = { percent: '0%', amount: 0 }
    const price = this.selectedVariant.price;
    
    switch (price_adjustment.value_type) {
      case 'percentage':
        discount.percent = `${price_adjustment.value}%`
        discount.amount = Math.round(
          (price * price_adjustment.value) / 100.0
        )
        break
      case 'fixed_amount':
        discount.percent = `${Math.round(
          ((price_adjustment.value * 1.0) / price) * 100.0
        )}%`
        discount.amount = price_adjustment.value
        break
      case 'price':
        discount.percent = `${Math.round(
          (((price - price_adjustment.value) * 1.0) /
            price) *
            100.0
        )}%`
        discount.amount = price - price_adjustment.value
        break
    }
    
    return discount
  }

  // Calculates the variant's price for the given selling plan, returns a formatted money value (if desired)
  price(selling_plan, formatted = true) {
    return formatted
      ? this.money(this.selectedVariant.price - this.discount(selling_plan).amount)
      : this.selectedVariant.price - this.discount(selling_plan).amount
  }

  // Optional functions keep if necessary 

  /**
   *   
   * 
   */
  
  // Runs a fetch request to add the selectedVariant to the cart with the passed quantity and selectedSellingPlan
  addToCart(quantity) {
    const items = [
      {
        id: this.selectedVariant.id,
        quantity: quantity,
        ...(this.selectedSellingPlan && { selling_plan: this.selectedSellingPlan?.id })
      }
    ];

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    })
    .then((response) => response.json())
    .then((response) => {
      this.log("SKIO added item to cart: ", response);
      //dispatch CustomEvent to tell document that an item was added to cart
      const event = new CustomEvent(`skio::added-to-cart`, {
        bubbles: true, 
        composed: true, 
        detail: {
          response,
          key: this.key
        }
      });

      this.dispatchEvent(event);
    })
    .catch((error) => {
      this.error(`SKIO ${ this.key } error adding item to cart: `, error);
    });
  } 

  fetchProduct = (handle) => {
    return fetch(`/products/${ handle }.js`)
    .then((response) => response.json())
    .then((product) => {
      this.product = product;
      this.selectedVariant = product.variants[0];

      return product;
    });
  }

  // If a form ID was passed, updates the form's selling_plan and property[Discount] fields
  updateForm() {
    if (this.formId) {
      let form = document.querySelector("#" + this.formId);
      if (form) {
        let selling_plan_input = form.querySelector('[name="selling_plan"]');
        if (selling_plan_input) {
          selling_plan_input.value = this.selectedSellingPlan !== null && this.selectedSellingPlan !== undefined ? this.selectedSellingPlan?.id : '';
        }
        else {
          selling_plan_input = document.createElement('input');
          selling_plan_input.type = "hidden";
          selling_plan_input.name = "selling_plan";
          selling_plan_input.value = this.selectedSellingPlan !== null && this.selectedSellingPlan !== undefined ? this.selectedSellingPlan?.id : '';
          form.append(selling_plan_input);
        }

        let discount = this.discount(this.selectedSellingPlan);
        let discount_input = form.querySelector('[name="properties[Discount]"]');
        if (discount.percent !== '0%') {
          if (discount_input) discount_input.value = this.selectedSellingPlan !== null ? this.discount(this.selectedSellingPlan).percent : null;
          else {
            discount_input = document.createElement('input');
            discount_input.type = "hidden";
            discount_input.name = "properties[Discount]";
            discount_input.value = this.selectedSellingPlan !== null ? this.discount(this.selectedSellingPlan).percent : null;
            form.append(discount_input);
          }
        } else {
          if (discount_input) discount_input.remove();
        }

      } else {
        console.log(`Skio error: form ID is ${ this.formId }, but no form with that ID was found.`);
      }
    }
  }

}

customElements.define('skio-plan-picker', SkioPlanPickerComponent);


//button element code
// class SkioPlanPickerButtonComponent extends LitElement {
//   static properties = {
//     selected_selling_plan_group: { type: Object },
//     selected_selling_plan: { type: Object }
//   }

//   constructor() {
//     super();

//     this.selected_selling_plan_group = null;
//     this.selected_selling_plan = null;
//   }

//   selectSellingPlan(selling_plan) {
//     this.selected_selling_plan = selling_plan;
//     document.querySelector('skio-plan-picker').selectedSellingPlan = selling_plan;
//   }

//   render() {
//     return html`
//       ${ this.selected_selling_plan_group ? this.selected_selling_plan_group.selling_plans.map((selling_plan) => 
//         html`
//         <input type="radio" name="selling_plan_button" value="${ selling_plan.id }" id="selling_plan_button-${ selling_plan.id }" @change="${(e) => this.selectSellingPlan(selling_plan) }" ${ this.selectedSellingPlan?.id == selling_plan.id ? 'checked' : '' }/>
//         <label for="selling_plan_button-${ selling_plan.id }">
//           ${ this.selected_selling_plan_group.name == 'Subscription' ? `Delivery ${ selling_plan.name }` : `${ selling_plan.name }` }
//         </label
//         `
//       ): ''}
//     `;
//   }
// }