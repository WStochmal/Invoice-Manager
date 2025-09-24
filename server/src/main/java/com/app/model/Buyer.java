package com.app.model;




import com.app.util.Required;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.UUID;


@Data
public class Buyer {

    @Required
    private String name; // Company name
    @Required
    @JsonProperty("NIP")
    private String nip;
    //    Address fields
    @Required
    private String street;
    @Required
    private String city;
    @Required
    private String postalCode;
}
