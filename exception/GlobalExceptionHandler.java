package com.tu.vendingmanagement.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<Map<String,Object>> notFound(NotFoundException ex){return response(HttpStatus.NOT_FOUND, ex.getMessage());}
    @ExceptionHandler(BadRequestException.class)
    ResponseEntity<Map<String,Object>> badRequest(BadRequestException ex){return response(HttpStatus.BAD_REQUEST, ex.getMessage());}
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String,Object>> validation(MethodArgumentNotValidException ex){
        Map<String,String> errors=new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(e->errors.put(e.getField(),e.getDefaultMessage()));
        Map<String,Object> body=new LinkedHashMap<>(); body.put("timestamp",Instant.now()); body.put("status",400); body.put("error","Validation failed"); body.put("fields",errors);
        return ResponseEntity.badRequest().body(body);
    }
    private ResponseEntity<Map<String,Object>> response(HttpStatus status,String message){
        Map<String,Object> body=new LinkedHashMap<>(); body.put("timestamp",Instant.now()); body.put("status",status.value()); body.put("error",message);
        return ResponseEntity.status(status).body(body);
    }
}
