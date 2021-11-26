package service;

import dao.SettingsDao;
import model.Setting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class SettingsServiceImpl implements SettingsService {

    private SettingsDao settingsDao;

    @Autowired
    public void setSettingsDao(SettingsDao settingsDao) {
        this.settingsDao = settingsDao;
    }

    @Override
    public void save(Setting setting) {
        settingsDao.save(setting);
    }

    @Override
    public Map<String, Object> getSettingsMap() {
        Map<String, Object> settings = new HashMap<>();
        settingsDao.findAll().forEach(setting -> settings.put(setting.getName(), setting.getValue()));

        return settings;
    }
}
