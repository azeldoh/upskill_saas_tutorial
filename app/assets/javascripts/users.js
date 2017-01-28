/* global $, Stripe */
// Document ready
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro_form');
    var submitBtn = $('#form-signup-btn');
    
    // Set Stripe public key
    Stripe.setPublishableKey( $('meta[name="stripe-key")').attr('content'));
    
    // When user clicks form sumbit btn prevent default sub behaviour
    submitBtn.click(function(event){
        event.preventDefault();
        
        // Collect cc fields
        var ccNum = $('#card_number').val(),
            cvcNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
       
        // Send cc info to stripe
        Stripe.createToken({
            number: ccNum,
            cvc: cvcNum,
            expMonth: expMonth,
            expYear: expYear
        }, stripeResponseHandler);
    });
    
    
    
   
    // Catch cc token
    // Injecting cc token as hidden field
    // Submit form to rails app
});