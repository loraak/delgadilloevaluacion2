package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
//esto nos va a sevir para mandar la información nomás, no se va a recibir nada. 
public class EmailDTO {
    private String destinatario; 
    private String asunto; 
    private String mensaje; 

    public String toString() { 
        return "EmailSenderDTO{" + 
            "to='" + destinatario + '\'' + 
            ", subject='" + asunto + '\'' + 
            ", message='" + mensaje + '\'' + 
            '}';        
    }
}
