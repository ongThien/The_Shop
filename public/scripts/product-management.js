const deleteProductBtnElements = document.querySelectorAll('.product-item button');

const deleteProduct = async (event) => {
  const btnElement = event.target;
  const productId = btnElement.dataset.productid;
  const csrfToken = btnElement.dataset.csrf;

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    method: 'DELETE'
  });

  if (!response.ok) {
    return alert('Something went wrong!');
  }

  btnElement.parentElement.parentElement.parentElement.parentElement.remove();
};

for (const deleteProductBtnElement of deleteProductBtnElements) {
  deleteProductBtnElement.addEventListener('click', deleteProduct);
}