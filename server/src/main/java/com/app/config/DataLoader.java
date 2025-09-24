package com.app.config;


import com.app.model.Invoice;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean

    public List<Invoice> invoices(){
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            InputStream inputStream = getClass().getResourceAsStream("/invoices.json");
            if (inputStream == null) {
                throw new IllegalArgumentException("Nie znaleziono pliku invoices.json w resources!");
            }
            return mapper.readValue(inputStream, new TypeReference<List<Invoice>>() {});
        } catch (Exception e){
            e.printStackTrace();
            return List.of();
        }
    }
}
