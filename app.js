// golbal variables
let active = "rubbleClick";
let inactive = [];
let others = [];
let activeId = "#rubbleDiv";
let qtyInCum,
  qtyInCft,
  qtyInUnits,
  qtyInsqm,
  qtyInSqft = "";

// get all inputbox for changing value as user changes value
const allIputTxt = document.querySelectorAll(".inputtxt");

//limit number to max of 999 for all Location,B and H inputs
const allLBHInputs = document.querySelectorAll(".Linput,.Winput,.Hinput");
for (let inputbox of allLBHInputs) {
  let y = 0;
  inputbox.addEventListener("input", function (e) {
    let x = y;
    y = e.target.value;
    if (e.target.value > 999 || e.target.value < 0) {
      inputbox.value = x;
      y = x;
      x = 0;
    }
  });
}
// limit user from entering thickness more than 50 mm
const allThkInputs = document.querySelectorAll("#mortarThk,#plasterThk");
for (let thkInput of allThkInputs) {
  let y = 0;
  thkInput.addEventListener("input", function (e) {
    let x = y;
    y = e.target.value;
    if (e.target.value > 50 || e.target.value < 0) {
      thkInput.value = x;
      y = x;
      x = 0;
    }
  });
}
// limit user from entering number of elements morethan 100
const allNumInputs = document.querySelectorAll("#noOfEle");
for (let numInput of allNumInputs) {
  let y = 0;
  numInput.addEventListener("input", function (e) {
    let x = y;
    y = e.target.value;
    if (e.target.value > 100 || e.target.value < 0) {
      numInput.value = x;
      y = x;
      x = 0;
    }
  });
}

//get all four div with clickable class for hiding and showing different div section for the appropriate section
const allDivs = document.querySelectorAll(".clickable");
const createOthers = () => {
  for (let i of allDivs) {
    others.push(i.getAttribute("id"));
  }
};
// show selected div and hide all others
const hideShow = (activeDiv, inactiveDivs) => {
  activeId = "#" + active.substring(0, active.length - 5) + "Div";
  document.querySelector(`${activeId}`).classList.remove("hide");
  for (let item of inactive) {
    let inactiveId = "#" + item.substring(0, item.length - 5) + "Div";
    document.querySelector(`${inactiveId}`).classList.add("hide");
  }
};
// change color of selected div buttons (clicked)
const changeColor = (Div, Divs) => {
  let curDiv = "#" + active;
  // console.log(curDiv)
  document.querySelector(`${curDiv}`).classList.remove("bg-dark");
  document.querySelector(`${curDiv}`).classList.add("bg-primary");
  for (let item of inactive) {
    let otherDiv = "#" + item;
    // console.log(otherDiv)
    document.querySelector(`${otherDiv}`).classList.remove("bg-primary");
    document.querySelector(`${otherDiv}`).classList.add("bg-dark");
  }
};
// pass ids of selected div and nonselected divs for hideshow and change color functions
for (let div of allDivs) {
  div.addEventListener("click", () => {
    createOthers();
    let index = others.indexOf(div.getAttribute("id"));
    let current = div.getAttribute("id");
    active = current;
    others.splice(index, 1);
    inactive = [...others];
    current = "";
    others = [];
    hideShow(active, inactive);
    changeColor(active, inactive);
  });
}
// qet qty in cum for rubble,blockwork, rcc sections and qtyin sqm for plastering section saved as global variables
for (let input of allIputTxt) {
  input.addEventListener("input", function () {
    let str = active.substring(0, active.length - 5) + "Div";
    // console.log(str)
    if (
      activeId ===
      "#" + input.parentElement.parentElement.parentElement.getAttribute("id")
    ) {
      if (str != "plasteringDiv") {
        qtyInCum = (
          document.getElementById(`${str}`).getElementsByClassName("Linput")[0]
            .value *
          document.getElementById(`${str}`).getElementsByClassName("Winput")[0]
            .value *
          document.getElementById(`${str}`).getElementsByClassName("Hinput")[0]
            .value
        ).toFixed(2);
        qtyInCft = (qtyInCum * 35.31466672).toFixed(2);
        qtyInUnits = (qtyInCft / 100).toFixed(2);
      } else {
        qtyInsqm = (
          document.getElementById(`${str}`).getElementsByClassName("Linput")[0]
            .value *
          document.getElementById(`${str}`).getElementsByClassName("Winput")[0]
            .value
        ) //*
          //document.getElementById(`${str}`).getElementsByClassName("Hinput")[0]
          //.value
          .toFixed(2);
        qtyInSqft = (qtyInCum * 10.76).toFixed(2);
        // qtyInUnits = (qtyInCft / 100).toFixed(2);
      }
    }
    // pass the current div id to updateQty function for calculating values based on the active section ie,rubble,rcc,blockwork,plasteting etc
    updateQty(str);
  });
}

// rcc element change updations
document.querySelector("#element").addEventListener("input", () => {
  updateQty(
    document
      .querySelector("#element")
      .parentElement.parentElement.parentElement.getAttribute("id")
  );
});
document.querySelector("#rccRatio").addEventListener("input", () => {
  updateQty(
    document
      .querySelector("#rccRatio")
      .parentElement.parentElement.parentElement.getAttribute("id")
  );
});

document.querySelector("#noOfEle").addEventListener("input", () => {
  updateQty(
    document
      .querySelector("#noOfEle")
      .parentElement.parentElement.parentElement.getAttribute("id")
  );
});
// wlockwork elements change updations
document.querySelector("#BrickSize").addEventListener("input", () => {
  updateQty(
    document
      .querySelector("#BrickSize")
      .parentElement.parentElement.parentElement.getAttribute("id")
  );
});
document.querySelector("#bwRatio").addEventListener("input", () => {
  updateQty(
    document
      .querySelector("#bwRatio")
      .parentElement.parentElement.parentElement.getAttribute("id")
  );
});

document.querySelector("#mortarThk").addEventListener("input", () => {
  updateQty(
    document
      .querySelector("#mortarThk")
      .parentElement.parentElement.parentElement.getAttribute("id")
  );
});

// plastering elements change updations

document.querySelector("#plasteringRatio").addEventListener("input", () => {
  updateQty(
    document
      .querySelector("#plasteringRatio")
      .parentElement.parentElement.parentElement.getAttribute("id")
  );
});

document.querySelector("#plasterThk").addEventListener("input", () => {
  updateQty(
    document
      .querySelector("#plasterThk")
      .parentElement.parentElement.parentElement.getAttribute("id")
  );
});

// calculating qty for each section based on the current active div and inputs (dynamically updated for all changes)
function updateQty(divEle) {
  // calculating qty of the active div is rcc div
  if (divEle === "rccDiv") {
    let cementIncum, aggPart, sandPart;
    cmt = 0;
    if (qtyInCum > 0) {
      // get dry mix (qty*no of elements) from (qty multiplied by 1.54)
      let concQty =
        parseFloat(qtyInCum) *
        parseFloat(document.querySelector("#noOfEle").value).toFixed(2) *
        1.54;
      let rccRatio = document.querySelector("#rccRatio").value;

      let steelQty =
        document.querySelector("#element").value *
        qtyInCum *
        document.querySelector("#noOfEle").value;
      if (rccRatio === "1") {
        cementIncum = (concQty / 16) * 1;
        aggPart = (concQty / 16) * 5;
        sandPart = (concQty / 16) * 10;
        cmt = "";
      } else if (rccRatio === "2") {
        cementIncum = (concQty / 13) * 1;
        aggPart = (concQty / 13) * 4;
        sandPart = (concQty / 13) * 8;
        cmt = "";
      } else if (rccRatio === "3") {
        cementIncum = (concQty / 10) * 1;
        aggPart = (concQty / 10) * 3;
        sandPart = (concQty / 10) * 6;
        cmt = "";
      } else if (rccRatio === "4") {
        cementIncum = (concQty / 7) * 1;
        aggPart = (concQty / 7) * 2;
        sandPart = (concQty / 7) * 4;
        cmt = "";
      } else if (rccRatio === "5") {
        cementIncum = (concQty / 5.5) * 1;
        aggPart = (concQty / 5.5) * 1.5;
        sandPart = (concQty / 5.5) * 3;
        cmt =
          (
            parseFloat(qtyInCum) *
            parseFloat(document.querySelector("#noOfEle").value).toFixed(2) *
            7
          ).toFixed(2) + "(as per local)";
      } else if (rccRatio === "6") {
        cementIncum = (concQty / 4) * 1;
        aggPart = (concQty / 4) * 1;
        sandPart = (concQty / 4) * 2;
        cmt = "";
      }
      cementIncum = parseFloat(cementIncum);
      aggPart = parseFloat(aggPart);
      sandPart = parseFloat(sandPart);
      document.querySelector("#steelKg").value = `${steelQty.toFixed(
        2
      )} Kg , ${(steelQty / 1000).toFixed(2)}(ton)`;
      document.querySelector("#rcccementBags").value = `${cementIncum.toFixed(
        2
      )} CUM , ${(cementIncum * 1440).toFixed(2)} Kg , ${(
        (cementIncum * 1440) /
        50
      ).toFixed(2)}(50 Kg Bags) ${cmt}`;
      document.querySelector("#aggregates").value = `${aggPart.toFixed(
        2
      )} CUM , ${(aggPart * 35.31466672).toFixed(2)} CFT , ${(
        (aggPart * 35.31466672) /
        100
      ).toFixed(2)} Units`;
      document.querySelector("#sand").value = `${sandPart.toFixed(2)} CUM , ${(
        sandPart * 35.31466672
      ).toFixed(2)} CFT , ${((sandPart * 35.31466672) / 100).toFixed(2)} Units`;
    } else {
      document.querySelector("#steelKg").value = "";
      document.querySelector("#rcccementBags").value = "";
      document.querySelector("#aggregates").value = "";
      document.querySelector("#sand").value = "";
    }
    // calculating qty of the active div is rubble div
  } else if (divEle === "rubbleDiv") {
    if (qtyInCum > 0) {
      document.querySelector(
        "#unitOfRubble"
      ).value = `${qtyInCum} CUM , ${qtyInCft} CFT , ${qtyInUnits} Units`;
    } else {
      document.querySelector("#unitOfRubble").value = "";
    }
    // calculating qty of the active div is block work div
  } else if (divEle === "blockWorkDiv") {
    let brickVolume,
      wetMoratarVolume,
      brickWithMortar,
      noOfBricks = 0;
    let cementIncum,
      sandPart = 0;
    let mortarThk = parseFloat(
      document.querySelector("#mortarThk").value / 1000
    );
    if (qtyInCum > 0) {
      let totalVolume = qtyInCum;
      let BrickSize = document.querySelector("#BrickSize").value;
      if (BrickSize === "1") {
        brickVolume = 0.2 * 0.1 * 0.1;
        brickWithMortar =
          (0.2 + mortarThk) * (0.1 + mortarThk) * (0.1 + mortarThk);
        noOfBricks = (totalVolume / brickWithMortar).toFixed(2);
      } else if (BrickSize === "2") {
        brickVolume = 0.2 * 0.1 * 0.075;
        brickWithMortar =
          (0.2 + mortarThk) * (0.1 + mortarThk) * (0.075 + mortarThk);
        noOfBricks = (totalVolume / brickWithMortar).toFixed(2);
      } else if (BrickSize === "3") {
        brickVolume = 0.3 * 0.2 * 0.15;
        brickWithMortar =
          (0.3 + mortarThk) * (0.2 + mortarThk) * (0.15 + mortarThk);
        noOfBricks = (totalVolume / brickWithMortar).toFixed(2);
      } else if (BrickSize === "4") {
        brickVolume = 0.3 * 0.2 * 0.1;
        brickWithMortar =
          (0.3 + mortarThk) * (0.2 + mortarThk) * (0.1 + mortarThk);
        noOfBricks = (totalVolume / brickWithMortar).toFixed(2);
      }
      totalVolume = totalVolume;
      noOfBricks = parseFloat(noOfBricks);
      brickVolume = parseFloat(brickVolume);
      brickWithMortar = parseFloat(brickWithMortar);
      wetMoratarVolume = totalVolume - noOfBricks * brickVolume;
      let dryMortarVolume = wetMoratarVolume * 1.33;
      let bwRatio = document.querySelector("#bwRatio").value;
      if (bwRatio === "1") {
        cementIncum = dryMortarVolume * (1 / 4);
        sandPart = dryMortarVolume * (3 / 4);
      } else if (bwRatio === "2") {
        cementIncum = dryMortarVolume * (1 / 5);
        sandPart = dryMortarVolume * (4 / 5);
      } else if (bwRatio === "3") {
        cementIncum = dryMortarVolume * (1 / 6);
        sandPart = dryMortarVolume * (5 / 6);
      } else if (bwRatio === "4") {
        cementIncum = dryMortarVolume * (1 / 7);
        sandPart = dryMortarVolume * (6 / 7);
      } else if (bwRatio === "5") {
        cementIncum = dryMortarVolume * (1 / 8);
        sandPart = dryMortarVolume * (7 / 8);
      } else if (bwRatio === "6") {
        cementIncum = dryMortarVolume * (1 / 9);
        sandPart = dryMortarVolume * (8 / 9);
      }
      cementIncum = parseFloat(cementIncum);
      sandPart = parseFloat(sandPart);
      document.querySelector("#NoOfBricks").value = `${noOfBricks.toFixed(
        0
      )} Nos`;
      document.querySelector("#bwCementBags").value = `${cementIncum.toFixed(
        2
      )} CUM , ${(cementIncum * 1440).toFixed(2)} Kg , ${(
        (cementIncum * 1440) /
        50
      ).toFixed(2)}(50 Kg Bags)`;
      document.querySelector("#bwSand").value = `${sandPart.toFixed(
        2
      )} CUM , ${(sandPart * 35.31466672).toFixed(2)} CFT , ${(
        (sandPart * 35.31466672) /
        100
      ).toFixed(2)} Units`;
    } else {
      document.querySelector("#NoOfBricks").value = "";
      document.querySelector("#bwCementBags").value = "";
      document.querySelector("#bwSand").value = "";
    }
    // calculating qty of the active div is plastering Div
  } else if (divEle === "plasteringDiv") {
    let cementIncum,
      sandPart,
      dryMortarVolume = 0;
    let plasterThk = document.querySelector("#plasterThk").value / 1000;
    if (qtyInsqm > 0) {
      let dryMortarVolume = parseFloat(qtyInsqm * plasterThk * 1.54);
      let plasteringRatio = document.querySelector("#plasteringRatio").value;
      if (plasteringRatio === "1") {
        cementIncum = dryMortarVolume * (1 / 4);
        sandPart = dryMortarVolume * (3 / 4);
      } else if (plasteringRatio === "2") {
        cementIncum = dryMortarVolume * (1 / 5);
        sandPart = dryMortarVolume * (4 / 5);
      } else if (plasteringRatio === "3") {
        cementIncum = dryMortarVolume * (1 / 6);
        sandPart = dryMortarVolume * (5 / 6);
      } else if (plasteringRatio === "4") {
        cementIncum = dryMortarVolume * (1 / 7);
        sandPart = dryMortarVolume * (6 / 7);
      } else if (plasteringRatio === "5") {
        cementIncum = dryMortarVolume * (1 / 8);
        sandPart = dryMortarVolume * (7 / 8);
      } else if (plasteringRatio === "6") {
        cementIncum = dryMortarVolume * (1 / 9);
        sandPart = dryMortarVolume * (8 / 9);
      }
      cementIncum = parseFloat(cementIncum);
      sandPart = parseFloat(sandPart);
      dryMortarVolume = parseFloat(dryMortarVolume);
      document.querySelector(
        "#plasterCementBags"
      ).value = `${cementIncum.toFixed(2)} CUM , ${(cementIncum * 1440).toFixed(
        2
      )} Kg , ${((cementIncum * 1440) / 50).toFixed(2)}(50 Kg Bags)`;
      document.querySelector("#plasterSand").value = `${sandPart.toFixed(
        2
      )} CUM , ${(sandPart * 35.31466672).toFixed(2)} CFT , ${(
        (sandPart * 35.31466672) /
        100
      ).toFixed(2)} Units`;
    } else {
      document.querySelector("#plasterCementBags").value = "";
      document.querySelector("#plasterSand").value = "";
    }
  }
}

// this code added to generic function above for click event in div

// function createOthers() {
//   // create other array with id attributes of all four divs
//   for (let i of allDivs) {
//     others.push(i.getAttribute("id"));
//   }
// }

// for (let div of allDivs) {
//   div.addEventListener("click", function () {
//     createOthers();
//     let index = others.indexOf(div.getAttribute("id"));
//     current = div.getAttribute("id");
//     active = current;
//     others.splice(index, 1);
//     inactive = [...others];
//     current = "";
//     others = [];
//     hideShow(active, inactive);
//   });
// }
// function hideShow(active, inactive) {
//   activeId = "#" + active.substring(0, active.length - 5) + "Div";
//   document.querySelector(`${activeId}`).classList.remove("hide");
//   for (let item of inactive) {
//     inactiveId = "#" + item.substring(0, item.length - 5) + "Div";
//     document.querySelector(`${inactiveId}`).classList.add("hide");
//   }
// }

// blockWorkClick.addEventListener("click", function ()  {
//   blockWorkDiv.classList.remove("hide")
//   rubbleDiv.classList.add("hide")
//   rccDiv.classList.add("hide")
//   plasteringDiv.classList.add("hide")
// });
// rubbleClick.addEventListener("click", function ()  {
//   rubbleDiv.classList.remove("hide")
//   blockWorkDiv.classList.add("hide")
//   rccDiv.classList.add("hide")
//   plasteringDiv.classList.add("hide")
// });
// rccClick.addEventListener("click", function ()  {
//   rccDiv.classList.remove("hide")
//   blockWorkDiv.classList.add("hide")
//   rubbleDiv.classList.add("hide")
//   plasteringDiv.classList.add("hide")
// });
// plasteringClick.addEventListener("click", function ()  {
//   plasteringDiv.classList.remove("hide")
//   blockWorkDiv.classList.add("hide")
//   rubbleDiv.classList.add("hide")
//   rccDiv.classList.add("hide")
// });
