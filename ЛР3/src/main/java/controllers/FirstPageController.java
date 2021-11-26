package controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;
import service.SettingsService;

@Controller
public class FirstPageController {

    private SettingsService settingsService;

    @Autowired
    public void setSettingsService(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/")
    public ModelAndView connectionCheck(Model model) {
        model.addAttribute("settings", settingsService.getSettingsMap());

        return new ModelAndView("index");
    }
}
