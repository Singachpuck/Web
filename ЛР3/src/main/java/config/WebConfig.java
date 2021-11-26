package config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import javax.servlet.ServletContext;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"model", "controllers", "service", "dao", "config"})
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    ServletContextTemplateResolver tr;

    @Bean
    public ServletContextTemplateResolver templateResolver(ServletContext servletContext) {
        ServletContextTemplateResolver tr = new ServletContextTemplateResolver(servletContext);
        tr.setPrefix("/WEB-INF/html/");
        tr.setSuffix(".html");
        tr.setTemplateMode(TemplateMode.HTML);

        return tr;
    }

    @Bean
    @DependsOn("templateResolver")
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine te = new SpringTemplateEngine();
        te.setTemplateResolver(tr);
        return te;
    }

    @Bean
    public ViewResolver viewResolver() {
        ThymeleafViewResolver vr = new ThymeleafViewResolver();
        vr.setTemplateEngine(templateEngine());
        vr.setOrder(1);

        return vr;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("/");
    }
}

