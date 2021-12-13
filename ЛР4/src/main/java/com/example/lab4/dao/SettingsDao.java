package com.example.lab4.dao;

import com.example.lab4.model.Setting;
import org.springframework.data.repository.CrudRepository;

public interface SettingsDao extends CrudRepository<Setting, String> {
}
