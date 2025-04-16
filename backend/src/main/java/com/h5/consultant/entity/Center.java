package com.h5.consultant.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "center")
public class Center {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "center_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "center_name", nullable = false, length = 50)
    private String centerName;

    @Size(max = 30)
    @NotNull
    @Column(name = "center_contact", nullable = false, length = 30)
    private String centerContact;

    @Builder.Default
    @OneToMany(mappedBy = "center")
    private Set<ConsultantUserEntity> consultantUserEntities = new LinkedHashSet<>();

}