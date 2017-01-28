/* global $, Stripe */
// Document ready
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro_form');
    var submitBtn = $('#form-signup-btn');
    
    // Set Stripe public key
    Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content'));
    
    // When user clicks form submit btn prevent default sub behaviour
    submitBtn.click(function(event){
        event.preventDefault();
        submitBtn.val("Processing").prop('disabled', true);
        // Collect cc fields
        var ccNum = $('#card_number').val(),
            cvcNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
            
        // Use stripe js to check for card errors
        var error = false;
        
        // Validate card number
        if(!Stripe.card.validateCardNumber(ccNum)) {
            error = true;
            alert('The credit card number appears to be invalid');
        }
        // Validate CVC
        if(!Stripe.card.validateCVC(cvcNum)) {
            error = true;
            alert('The CVC number appears to be invalid');
        }
        // Validate exp date
        if(!Stripe.card.validateExpiry(expMonth, expYear)) {
            error = true;
            alert('The expiration date appears to be invalid');
        }
        
       
       if (error) {
            // If there are card errors don't send to stripe and reenable btn
            submitBtn.prop('disabled', false).val("Sign Up");
       } else {
           // Send cc info to stripe
            Stripe.createToken({
                number: ccNum,
                cvc: cvcNum,
                expMonth: expMonth,
                expYear: expYear,
             }, stripeResponseHandler);
       }
        return false;
    });
    
    // Catch cc token
    function stripeResponseHandler(status, response) {
        var token = response.id;
        
        // Inject cc token as hidden field
        theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
        
        // Submit form to rails app
        theForm.get(0).submit();
    }
});