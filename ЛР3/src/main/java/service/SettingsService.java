package service;

import model.Setting;

import java.util.List;
import java.util.Map;

public interface SettingsService {
    void save(Setting setting);
    Map<String, Object> getSettingsMap();
}
