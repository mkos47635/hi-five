package com.h5.schedule.entity;

import com.h5.child.entity.ChildUserEntity;
import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.parent.entity.ParentUserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consult_meeting_schdl")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultMeetingScheduleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_schdl_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "schdl_dttm", nullable = false)
    private LocalDateTime schdlDttm;

    @NotNull
    @Column(name = "create_dttm", nullable = false, updatable = false)
    private LocalDateTime createDttm;

    @Column(name = "update_dttm")
    private LocalDateTime updateDttm;

    @Column(name = "delete_dttm")
    private LocalDateTime deleteDttm;

    @NotNull
    @Column(name = "start_dttm", nullable = false)
    private LocalDateTime startDttm;

    @NotNull
    @Lob
    @Column(name = "status", nullable = false)
    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "host_id", nullable = false)
    private ConsultantUserEntity host;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_user_id", nullable = false)
    private ParentUserEntity parentUserEntity;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false)
    private ChildUserEntity childUserEntity;

    @Size(max = 225)
    @Column(name = "session_id", length = 225)
    private String sessionId;

    @PrePersist
    protected void onCreate() {
        this.createDttm = LocalDateTime.now();
        this.updateDttm = this.createDttm;
        this.startDttm = (this.schdlDttm != null) ? this.schdlDttm.minusMinutes(10) : null;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateDttm = LocalDateTime.now();
    }
}
