let cart=[];
function addToCart(id,name,price,stock){

let existing=cart.find(item=>item.id===id);
if(existing){
    if(existing.qty>=stock){
        alert('Stocks out of limit');
        return;
    }
    existing.qty+=1;
    }
    else{
        cart.push({id,name,price,qty:1,stock});
    }
    console.log(cart);
    render()


}
function render(){
let tbody=document.getElementById('cart-items');
tbody.innerHTML='';
if(cart.length==0){
    tbody.innerHTML=` <tr id="empty-cart-msg">
                            <td colspan="5" class="empty-msg">No items added yet</td>
                        </tr> `
}
else{
    let subtotal=0;
    cart.forEach(item=>{

        let itemTotal=item.price*item.qty;
        subtotal+=itemTotal;
        
        
        let tr=document.createElement('tr');
        tr.innerHTML=`
        
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.price}</td>
            <td>${itemTotal}</td>
            
          
            <td>
                <button class="cart-remove" onclick="removeFromCart('${item.id}')">
                    Remove
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    updateTotals(subtotal);
}

}
function updateTotals(subtotal) {
    let tax = subtotal * 0.18; // Assuming 18% tax
    let total = subtotal + tax;

    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('gst').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}
function removeFromCart(id){
    cart=cart.filter(item=>item.id!==id);
    render();
}
document.querySelector("#searchBox").addEventListener("input",function(){
    let searchTerm=this.value.toLowerCase().trim();
    let products=document.querySelectorAll(".product-card");

    products.forEach(product=>{
        let name=product.dataset.name.toLowerCase()||'';
        let category=product.dataset.category.toLowerCase()||'';
        if(name.includes(searchTerm)||category.includes(searchTerm)){
            product.style.display='flex';
        }
        else{
            product.style.display='none';
        }
    })
});
removeOneFromCart=function(id){
    let existing=cart.find(item=>item.id===id);
    if(existing){
        existing.qty-=1;
        if(existing.qty<1){
            cart=cart.filter(item=>item.id!==id);
        }
    }
    render();
}



//gen bill 

async function generateBill() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();

    if (!customerName || !customerPhone) {
        alert('Please enter customer name and phone number');
        return;
    }

    if (cart.length === 0) {
        alert('Cart is empty. Add at least one item.');
        return;
    }

    let subtotal = 0;
    const items = cart.map(item => {
        const total = item.price * item.qty;
        subtotal += total;
        return {
            id: item.id,
            name: item.name,
            qty: item.qty,
            price: item.price,
            total: total
        };
    });

    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;

    const payload = {
        customerName,
        customerPhone,
        items,
        subtotal: subtotal.toFixed(2),
        gst: gst.toFixed(2),
        total: grandTotal.toFixed(2)
    };

    try {
        const response = await fetch('/billing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Failed to generate bill');
        }

        const data = await response.json();
        console.log('Bill created:', data);

        // swap customer inputs for plain text so it shows up in print
        document.querySelector('.customer-section').innerHTML = `
            <h4>Customer Details</h4>
            <p><strong>${customerName}</strong></p>
            <p>${customerPhone}</p>
        `;

        window.print();

        // reload so the page re-fetches fresh stock, empty cart, empty inputs
        window.location.reload();

    } catch (err) {
        console.error(err);
        alert('Something went wrong while generating the bill');
    }
}