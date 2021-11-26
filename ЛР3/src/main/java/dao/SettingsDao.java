package dao;

import model.Setting;
import org.springframework.data.repository.CrudRepository;

public interface SettingsDao extends CrudRepository<Setting, String> {
}
