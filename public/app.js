$(document).ready(function() {
  $(document).foundation();

  // Input mask formatting
  $('input.date').mask('00/00/0000');
  $('input.ssn').mask('000-00-0000');
  $('input.phone').mask('(000) 000-0000 x 000000');
  $('input.zip').mask('00000-0000');

  $('.currency').maskMoney({
    prefix: '$',
    precision: 0,
    reverse: true
  });

  // Set current date in forms
  $('.current-date').val(function() {
    var d = new Date();
    var strDate = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
    return strDate;
  });

  // Form inputs label JS assistant
  let $inputs = "[type='text'], [type='password'], [type='date'], [type='datetime'], [type='datetime-local'], [type='month'], [type='week'], [type='email'], [type='number'], [type='search'], [type='tel'], [type='time'], [type='url'], [type='color'], select, textarea";
  $('select').parent().addClass('has-value');
  $($inputs).focusin(function(){
    $(this).parent().addClass('has-value');
  });
  $($inputs).blur(function(){
    if(!$(this).val().length > 0 && $(this).prop('required')) {
      $(this).removeClass();
      $(this).siblings('span').children('em').remove();
      $(this).siblings('span').append( ' <em class="alert">Required</em>' );
      $(this).parent().addClass('required');
    } else if(!$(this).val().length > 0) {
      $(this).parent().removeClass('has-value');
    } else {
      $(this).siblings('span').children('em').remove();
      $(this).parent().removeClass('required');
    }
  });

  // Apply form state resident alert
  $('select').change(function() {
    var selected = $(this).val();
    var selectedText = $("option:selected", $(this)).text();
    $('#ResidentAlert').addClass('hide');
    if (/^(new-york|vermont|connecticut|new-hampshire|west-virginia)$/.exec(selected)) {
      $('#ResidentAlert').removeClass('hide');
      $('#ResidentAlert .state').html(selectedText);
    }
  });

  // Press Page - Accordion list of press articles
  $('.press-list > div:gt(8)').addClass('hide');
  $('#TogglePressList').click(function(e) {
    e.preventDefault();
    $('.press-list > div:gt(8)').toggleClass('hide');
    $(this).toggleText('Show Less Press Articles','Show All Press Articles');
  });
  
});
