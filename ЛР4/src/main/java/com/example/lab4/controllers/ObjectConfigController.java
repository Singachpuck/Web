package com.example.lab4.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.lab4.model.ObjectParamsHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.lab4.service.ObjectService;

@RestController
@RequestMapping("/object")
public class ObjectConfigController {

    private ObjectService objectService;

    @Autowired
    public void setObjectService(ObjectService objectService) {
        this.objectService = objectService;
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveConfig(@RequestBody String objectsJSON) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            ObjectParamsHolder object = objectMapper.readValue(objectsJSON, ObjectParamsHolder.class);

            return ResponseEntity
                    .ok()
                    .header("Content-Type", "application/json")
                    .body(objectMapper.writeValueAsString(objectService.save(object)));
        } catch (JsonProcessingException e) {
            return ResponseEntity
                    .badRequest()
                    .header("Content-Type", "application/json")
                    .body("{\"success\": false, \"error\": \""+ e.getMessage() +"\"}");
        }
    }

    @GetMapping
    public ResponseEntity<String> getAll() {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            return ResponseEntity
                    .ok()
                    .header("Content-Type", "application/json")
                    .body(objectMapper.writeValueAsString(objectService.findAll()));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .header("Content-Type", "application/json")
                    .body("{\"success\": false, \"error\": \""+ e.getMessage() +"\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        try {
            objectService.deleteById(id);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .header("Content-Type", "application/json")
                    .body("{\"success\": false, \"error\": \"Bad id!\"}");
        }

        return ResponseEntity
                .ok()
                .header("Content-Type", "application/json")
                .body("{\"success\": true}");
    }
}
