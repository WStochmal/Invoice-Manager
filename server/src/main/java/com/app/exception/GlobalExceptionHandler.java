package com.app.exception;


import com.app.dto.ResponseDto;
import com.app.exception.invoice.InvoiceCreationException;
import com.app.exception.invoice.InvoiceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvoiceNotFoundException.class)
    public ResponseEntity<ResponseDto<Void>> handleInvoiceNotFoundException(InvoiceNotFoundException ex) {
        ResponseDto<Void> response = new ResponseDto<>(false, ex.getMessage(), null);
        return ResponseEntity.status(404).body(response);
    }
    @ExceptionHandler(InvoiceCreationException.class)
    public ResponseEntity<ResponseDto<Map<String, String>>> handleInvoiceCreationException(
            InvoiceCreationException ex) {
        ResponseDto<Map<String, String>> response = new ResponseDto<>(false, ex.getMessage(), ex.getFieldErrors());
        return ResponseEntity.status(400).body(response);
    }

      // JSON parse/type errors
      @ExceptionHandler(HttpMessageNotReadableException.class)
      public ResponseEntity<ResponseDto<Void>> handleJsonParseError(HttpMessageNotReadableException ex) {
        ResponseDto<Void> response = new ResponseDto<>(false, "INVALID_TYPE", null);
        return ResponseEntity.status(400).body(response);
      }
}
