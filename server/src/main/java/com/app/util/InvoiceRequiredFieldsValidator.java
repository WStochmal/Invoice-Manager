package com.app.util;

import com.app.exception.invoice.InvoiceCreationException;
import com.app.model.Buyer;
import com.app.model.Invoice;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InvoiceRequiredFieldsValidator {
    private InvoiceRequiredFieldsValidator() {
    }

    public static void validate(Invoice invoice) {
        Map<String, String> fieldErrors = new HashMap<>();

        for (Field field : Invoice.class.getDeclaredFields()) {
            if (!field.isAnnotationPresent(Required.class)) continue;
            String getterName = "get" + capitalize(field.getName());

            try {
                Method getter = Invoice.class.getMethod(getterName);
                Object value = getter.invoke(invoice);

                if (value == null) {
                    fieldErrors.put(field.getName(), "REQUIRED_FIELD_MISSING");
                    continue;
                }
                // Nested validation for Buyer
                if (field.getName().equals("buyer")) {
                    validateNestedFields((Buyer) value, fieldErrors,field.getName());
                }
                // Nested validation for items list
                if (field.getName().equals("items")) {
                    List<?> items = (List<?>) value;
                    if(!items.isEmpty()){
                        for (int i = 0; i < items.size(); i++) {
                            validateNestedFields(items.get(i), fieldErrors, field.getName() + "[" + i + "]");
                        }
                    } else {
                        fieldErrors.put(field.getName(), "REQUIRED_PRODUCTS_MISSING" );
                    }
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        if (!fieldErrors.isEmpty()) {
            throw new InvoiceCreationException(fieldErrors);
        }
    }

    //    Validation of nested fields eg. Buyer, Product
    private static void validateNestedFields(Object obj, Map<String, String> fieldErrors, String prefix) {
        for (Field field : obj.getClass().getDeclaredFields()) {
            if (!field.isAnnotationPresent(Required.class)) continue;
            String getterName = "get" + capitalize(field.getName());
            try {
                Method getter = obj.getClass().getMethod(getterName);
                Object value = getter.invoke(obj);

                String fieldKey = prefix.isEmpty() ? field.getName() : prefix + "." + field.getName();
                if (value == null) {
                    fieldErrors.put(fieldKey, "REQUIRED_FIELD_MISSING");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private static String capitalize(String s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }
}
