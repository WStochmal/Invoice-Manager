package com.app.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@AllArgsConstructor
public class ResponseDto<T> {
    private boolean success;
    private String messageCode;
    private T data;

}
