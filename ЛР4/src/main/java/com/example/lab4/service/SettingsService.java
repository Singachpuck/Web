package com.example.lab4.service;

import com.example.lab4.model.Setting;

import java.util.Map;

public interface SettingsService {
    void save(Setting setting);
    Map<String, Object> getSettingsMap();
}
