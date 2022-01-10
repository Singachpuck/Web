package com.example.lab4.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.lab4.dao.SettingsDao;
import com.example.lab4.model.Setting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/settings")
public class SettingController {

    private SettingsDao settingsDao;

    @Autowired
    public void setSettingsDao(SettingsDao settingsDao) {
        this.settingsDao = settingsDao;
    }

    @PutMapping
    public ResponseEntity<String> updateSetting(@RequestBody String settingsJSON) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            List<Setting> settings = Arrays.asList(objectMapper.readValue(settingsJSON, Setting[].class));

            settingsDao.saveAll(settings);

            return ResponseEntity
                    .ok()
                    .header("Content-Type", "application/json")
                    .body("{\"success\": true}");
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .header("Content-Type", "application/json")
                    .body("{\"success\": false, \"error\": \""+ e.getMessage() +"\"}");
        }
    }

    @GetMapping("/{settingName}")
    public Map<String, Object> getSetting(@PathVariable String settingName) {
        try {
            return Map.of(settingName, settingsDao.getByName(settingName).getValue());
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("success", false, "message", e.getMessage());
        }
    }
}
