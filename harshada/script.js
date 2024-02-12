var options = {
    key: 'rzp_test_6GyGWyrZb4g9TU',
    amount: 50000, // Amount is in currency subunits. 1000 = 10 INR
    currency: 'INR',
    name: 'Snehalay Kendra',
    description: 'Test Payment',
    image: 'https://give.do/static/img/logos/1AG3/69a4645d-3d5f-49d1-a2f3-2b1b14ada625.png',
    
    handler: function(response) {
        alert('Payment successful: ' + response.razorpay_payment_id);
    }
};


var rzpButton = document.getElementById('donate');

rzpButton.onclick = function(e) {
    var rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();
}

