const container = document.querySelector(".container");
const products = document.querySelectorAll(".product");
const pallet = document.querySelector(".pallet");
const payButton = document.querySelector(".pay-button");

let countProducts = 0;

function initProduct(product) {
  product.addEventListener("pointerdown", () => {
    if (countProducts > 2) return;

    product.classList.remove("suspend");

    const containerRect = container.getBoundingClientRect();
    const productRect = product.getBoundingClientRect();

    const productHalfWidth = productRect.width / 2;
    const productHalfHeight = productRect.height / 2;

    function pointerMove(e) {
      const getMousePositionInRect = (evt, rect) => ({
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      });

      const { x, y } = getMousePositionInRect(e, containerRect);

      const positionX = x - productHalfWidth;
      const positionY = y - productHalfHeight;

      product.style.left = positionX + "px";
      product.style.top = positionY + "px";
      product.style.zIndex = 10;
    }

    /**
     * Стартовые позиции товара
     */
    const productStartX = product.style.left;
    const productStartY = product.style.top;

    function pointerEnd(e) {
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerup", pointerEnd);

      const checkPointInRect = ({ x, y }, rect) =>
        rect.left < x &&
        x < rect.right &&
        rect.top < y + productHalfHeight &&
        rect.bottom > y;

      product.classList.add("suspend");
      product.style.zIndex = 1;

      const palletRect = pallet.getBoundingClientRect();

      if (!checkPointInRect({ x: e.clientX, y: e.clientY }, palletRect)) {
        product.style.left = productStartX;
        product.style.top = productStartY;
        return;
      }

      product.classList.add("image-zoom");
      pallet.appendChild(product);

      countProducts++;
      payButton.hidden = countProducts < 3;
    }

    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerup", pointerEnd);
  });
}

products.forEach(initProduct);

payButton.addEventListener(
  "click",
  () => (document.location.href = "https://lavka.yandex.ru")
);
