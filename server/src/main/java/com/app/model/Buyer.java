package com.app.model;





import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class Buyer {

    @NotNull(message = "INVOICE_BUYER_NAME_NULL")
    private String name; // Company name

    @NotNull(message = "INVOICE_NIP_NULL")
    @Size(min = 10, max = 10, message = "INVOICE_NIP_LENGTH_INVALID")
    @JsonProperty("NIP")
    private String nip; // Company NIP

    // --- Address fields ---
    @NotNull(message = "INVOICE_STREET_NULL")
    private String street; // Company street address

    @NotNull(message = "INVOICE_CITY_NULL")
    private String city; // Company city location

    @NotNull(message = "INVOICE_POSTAL_CODE_NULL")
    @Pattern(regexp = "\\d{2}-\\d{3}", message = "INVOICE_POSTAL_CODE_INVALID")
    private String postalCode; // Company postal code
}
