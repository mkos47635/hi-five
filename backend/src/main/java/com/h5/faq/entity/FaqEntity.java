package com.h5.faq.entity;

import com.h5.consultant.entity.ConsultantUserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "faq")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FaqEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faq_id", nullable = false)
    private Integer id;

    @Size(max = 200)
    @NotNull
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @NotNull
    @Lob
    @Column(name = "faq_ans", nullable = false)
    private String faqAns;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "consultant_user_id", nullable = false)
    private ConsultantUserEntity consultantUser;

    @NotNull
    @Lob
    @Column(name = "type", nullable = false)
    private String type;

    enum type{
        usage,
        child,
        center
    }
}
