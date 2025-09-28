package com.app.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@AllArgsConstructor
public class ResponseDto<T> {
    private boolean success; // true if operation was successful, false otherwise
    private String messageCode; // code representing the result of the operation
    private T data; // the data being returned (if any)

}
