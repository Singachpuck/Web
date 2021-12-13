package com.example.lab4.model;

import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Table(name = "object")
public class ObjectParamsHolder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String value;
    private double font;

    public String getValue() {
        return value;
    }

    public Integer getId() {
        return id;
    }

    @Column(name = "id")
    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "value")
    public void setValue(String value) {
        this.value = value;
    }

    public double getFont() {
        return font;
    }

    @Column(name = "font")
    public void setFont(double font) {
        this.font = font;
    }
}
