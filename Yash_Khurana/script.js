document.querySelector("#generatePDF").addEventListener("click", () => {
  console.log("hmm");
  const content = document.querySelector("#bill-container");
  html2pdf().from(content).save();
});

// $("#generatePDF").click(function () {
//   doc.fromHTML($("#bill-container").html(), 15, 15, {
//     width: 700,
//     elementHandlers: specialElementHandlers,
//   });
//   doc.save("sample_file.pdf");
// });

// script part!

let itemsContainer = document.querySelector(".items-container");

let allItemsDetails = [];

// Seeting up the current date :)
var currentDate = document.querySelector("#current-date");
var date = new Date();
currentDate.innerHTML = ""
  .concat(date.getMonth() + 1, "/")
  .concat(date.getDate(), "/")
  .concat(date.getFullYear());

// invoice number
let invoiceNumber = document.querySelector("#invoice-number");

// to user details
let nameTo = document.getElementById("bill-to-name");
let emailTo = document.getElementById("bill-to-email");
let addressTo = document.getElementById("bill-to-address");

// from user details
let nameFrom = document.getElementById("bill-from-name");
let emailFrom = document.getElementById("bill-from-email");
let addressFrom = document.getElementById("bill-from-address");

let dueDate = document.getElementById("due-date");
document.getElementById("addItem").addEventListener("click", createItem);

// Creating items
function createItem(newItems) {
  if (newItems?.length !== undefined) {
    allItemsDetails = newItems;
  } else
    allItemsDetails.push({
      name: "",
      des: "",
      qty: 1,
      priceRate: 1,
    });

  calculateTotalSub();

  itemsContainer.innerHTML = "";
  allItemsDetails.map((item, idx) => {
    let IndividualItem = document.createElement("div");
    IndividualItem.classList.add("w-full", "flex", "gap-2", "py-3", "border-b");

    // names and des
    let nameDesContainer = document.createElement("div");
    nameDesContainer.classList.add("flex", "w-full", "flex-col", "gap-1");

    let inputName = document.createElement("input");
    inputName.placeholder = "Item Name";
    inputName.required = true;
    inputName.classList.add(
      "w-full",
      "px-2",
      "py-2",
      "bg-gray-100",
      "rounded-md"
    );
    inputName.value = item.name;
    inputName.addEventListener("input", () => {
      item.name = inputName.value;
    });

    let inputDes = document.createElement("input");
    inputDes.placeholder = "Item Description";
    inputDes.required = true;
    inputDes.classList.add(
      "w-full",
      "px-2",
      "py-2",
      "bg-gray-100",
      "rounded-md"
    );
    inputDes.value = item.des;
    inputDes.addEventListener("input", () => {
      item.des = inputDes.value;
    });

    // appending name/Des inputs
    nameDesContainer.append(inputName, inputDes);

    // QTY
    let qty = document.createElement("div");
    qty.classList.add("w-[10rem]");

    let inputQty = document.createElement("input");
    inputQty.type = "number";
    inputQty.value = 1;
    inputQty.classList.add(
      "w-full",
      "px-2",
      "py-2",
      "bg-gray-100",
      "rounded-md"
    );
    inputQty.value = item.qty;
    inputQty.addEventListener("input", () => {
      item.qty = inputQty.value;
      calculateTotalSub();
    });

    qty.append(inputQty);

    // Price and Rate
    let priceRate = document.createElement("div");
    priceRate.classList.add(
      "w-[12rem]",
      "md:w-[15rem]",
      "bg-gray-100",
      "rounded-md",
      "h-8",
      "px-2",
      "flex",
      "items-center",
      "gap-2"
    );

    let span = document.createElement("span");
    span.classList.add("text-gray-500", "text-[1.2rem]", "symbol");
    span.innerText = "$";

    let priceRateInput = document.createElement("input");
    priceRateInput.type = "number";
    priceRateInput.classList.add(
      "bg-gray-100",
      "outline-none",
      "h-full",
      "w-full"
    );
    priceRateInput.value = item.priceRate;
    priceRateInput.addEventListener("input", () => {
      item.priceRate = priceRateInput.value;
      calculateTotalSub();
    });
    priceRate.append(span, priceRateInput);

    // Action
    let action = document.createElement("div");
    action.classList.add("w-[10rem]");

    let btnDelete = document.createElement("button");
    btnDelete.classList.add(
      "p-2",
      "bg-red-600",
      "rounded-md",
      "ml-2",
      "hover:bg-red-700",
      "transition-colors",
      "duration-300"
    );

    btnDelete.addEventListener("click", () => {
      allItemsDetails.splice(idx, 1);
      createItem(allItemsDetails);
      calculateTotalSub();
    });

    let img = document.createElement("img");
    img.src = "bin.png";
    img.classList.add("filter", "w-4", "filterDemo");
    btnDelete.append(img);

    action.append(btnDelete);

    IndividualItem.append(nameDesContainer, qty, priceRate, action);
    itemsContainer.append(IndividualItem);
  });
}

let total = 0,
  subTotal = 0,
  discount = 0,
  tax = 0;

// calculate totals
function calculateTotalSub() {
  subTotal = allItemsDetails.reduce((acc, curVal) => {
    return acc + curVal.qty * curVal.priceRate;
  }, 0);

  document.getElementById("subtotal").innerText = subTotal;

  let discountVal = (subTotal * discount) / 100;
  let taxVal = (subTotal * tax) / 100;

  document.getElementById("discount").innerText = discountVal;
  document.getElementById("tax").innerText = taxVal;

  total = taxVal + subTotal-discountVal;
  document.getElementById("total").innerText = total;
}

// Right seciton
// tax
let taxInput = document.getElementById("tax-rate");
taxInput.addEventListener("input", () => {
  tax = taxInput.value;
  document.querySelector(".tax").innerHTML = `(${tax}%)`;
  calculateTotalSub();
});

// discount
let discountInput = document.getElementById("discount-rate");
discountInput.addEventListener("input", () => {
  discount = discountInput.value;
  document.querySelector(".discount").innerHTML = `(${discount}%)`;
  calculateTotalSub();
});

// country name and symbol
let currencyWiseSymbol = {
  USD: "$",
  GBP: "£",
  JPY: "¥",
  CAD: "$",
  AUD: "$",
  SGD: "$",
  CNY: "¥",
  BTC: "₿",
};

// Currecny Section
let Currecny = document.getElementById("currency");
Currecny.addEventListener("input", () => {
  console.log(currencyWiseSymbol[Currecny.value]);
  let symArr = document.querySelectorAll(".symbol");
  symArr.forEach((val) => {
    val.innerHTML = currencyWiseSymbol[Currecny.value];
  });
});

// invoice
let invoiceContainer = document.getElementById("invoice-container");
invoiceContainer.addEventListener("click", () => {
  if (invoiceContainer.classList.contains("hidden")) {
    invoiceContainer.classList.remove("hidden");
    invoiceContainer.classList.add("flex");
  } else {
    invoiceContainer.classList.remove("flex");
    invoiceContainer.classList.add("hidden");
  }
});

// review invoice click event
let reviewInvoice = document.getElementById("reviewInvoice");
reviewInvoice.addEventListener("click", (e) => {
  let isEmpty = allItemsDetails.find((val) => val.name == "" || val.des == "");
  if (
    !isEmpty &&
    dueDate.value &&
    nameTo.value &&
    addressTo.value &&
    emailTo.value &&
    nameFrom.value &&
    addressFrom.value &&
    emailFrom.value
  ) {
    e.preventDefault();
    invoiceContainer.classList.add("flex");
    invoiceContainer.classList.remove("hidden");

    let toName = document.querySelectorAll(".toName");
    toName.forEach((val) => {
      val.innerText = nameTo.value;
    });

    let amountDue = document.getElementById("amountDue");
    amountDue.innerText = `$${total}`;

    document.getElementById("addressTo").innerText = addressTo.value;

    // from
    document.querySelector(".fromName").innerHTML = nameFrom.value;
    document.querySelector("#addressFrom").innerHTML = addressFrom.value;

    // due date
    let dueDateBill = document.getElementById("dueDate");
    dueDateBill.innerText = dueDate.value;

    let itemsContainerBill = document.querySelector(".items-container-bill");
    itemsContainerBill.innerHTML = "";
    allItemsDetails.map((soloItem) => {
      let item = document.createElement("div");
      item.classList.add("flex", "w-full", "border-b", "py-2");

      let p = document.createElement("p");
      p.classList.add("qty-bill", "uppercase", "w-[10%]", "text-[0.8rem]");
      p.innerText = soloItem.qty;

      let p2 = document.createElement("p");
      p2.classList.add(
        "qty-bill",
        "uppercase",
        "w-[50%]",
        "md:w-[60%]",
        "text-[0.8rem]"
      );
      p2.innerText = soloItem.des;

      let p3 = document.createElement("p");
      p3.classList.add(
        "qty-bill",
        "uppercase",
        "w-[20%]",
        "md:w-[10%]",
        "text-[0.8rem]"
      );
      p3.innerText = `$${soloItem.priceRate}`;

      let p4 = document.createElement("p");
      p4.classList.add("qty-bill", "uppercase", "w-[20%]", "text-[0.8rem]");
      p4.innerText = `$${soloItem.qty * soloItem.priceRate}`;
      item.append(p, p2, p3, p4);
      itemsContainerBill.append(item);
    });

    document.getElementById("subtotal-bill").innerText = "$" + subTotal;
    document.getElementById("total-bill").innerText = "$" + total;
  }
});

document.querySelectorAll(".btns").forEach((val) => {
  val.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
  });
});
const sendInvoiceBtn = document.getElementById('sendInvoiceBtn');

    sendInvoiceBtn.addEventListener('click', function() {
        // Redirect to WhatsApp
        window.location.href = 'https://www.whatsapp.com/'; 
    });