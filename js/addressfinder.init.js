(function($, Drupal) {
  Drupal.behaviors.webform_address_finder = {
    attach:function() {
      $(document).ready(function() {
        /**
         * Sets readonly if the element value is not empty
         * @param $el
         */
        function setReadOnly($el, val = 'readonly') {
          $el.prop('readonly', val);
        }

        function setValueAndDisable($el = null, val = false, readonly = 'readonly') {
          if ($el == null) {
            return;
          }
          $el.val(val);
          setReadOnly($el, readonly);

        }
        if (typeof CRM === 'undefined') {
          return;
        }
        var key = CRM.vars.addressfinder.key;
        var address_id = 'civicrm-1-contact-1-address';
        if (!$("[id$='" + address_id + "-street-address']").length) {
          return;
        }
        var widget = new AddressFinder.Widget(
          $("[id$='" + address_id + "-street-address']")[0],
          key,
          'NZ',
          {byline: false, max_results: 8}
        );
        if ($("[id$='" + address_id + "-country-id']").val() == 1154) {
          $("[id$='" + address_id + "-street-address']").attr('placeholder', 'Start typing an address...');
          setReadOnly($("[id$='" + address_id + "-supplemental-address-2']"));
          setReadOnly($("[id$='" + address_id + "-city']"));
          setReadOnly($("[id$='" + address_id + "-postal-code']"));

          widget.on('result:select', function(fullAddress, metaData) {
            var selected = new AddressFinder.NZSelectedAddress(fullAddress, metaData);
            $("[id$='" + address_id + "-street-address']").val(selected.address_line_1_and_2());
            setValueAndDisable($("[id$='" + address_id + "-supplemental-address-2']"), selected.suburb());
            setValueAndDisable($("[id$='" + address_id + "-city']"), selected.city());
            setValueAndDisable($("[id$='" + address_id + "-postal-code']"), selected.postcode())
            $("[id$='" + address_id + "-country-id']").val('1154').trigger('change');
          });
        }

        $("[id$='" + address_id + "-country-id']").change(function(e) {
          if ($(this).val() == 1154) {
            $("[id$='" + address_id + "-street-address']").attr('placeholder', 'Start typing an address...');
            setReadOnly($("[id$='" + address_id + "-supplemental-address-2']"));
            setReadOnly($("[id$='" + address_id + "-city']"));
            setReadOnly($("[id$='" + address_id + "-postal-code']"));
            e.preventDefault();
            widget.enable();
          }
          else {
            $("[id$='" + address_id + "-street-address']").removeAttr('placeholder');
            $("[id$='" + address_id + "-street-address']").val('');
            $("[id$='" + address_id + "-supplemental-address-2']").val('');
            $("[id$='" + address_id + "-city']").val('');
            $("[id$='" + address_id + "-postal-code']").val('');

            setValueAndDisable($("[id$='" + address_id + "-supplemental-address-2']"), '', false);
            setValueAndDisable($("[id$='" + address_id + "-city']"), '', false);
            setValueAndDisable($("[id$='" + address_id + "-postal-code']"), '', false);
            e.preventDefault();
            widget.disable();
          }
        });


      });
    }
  };
}(jQuery, Drupal));
