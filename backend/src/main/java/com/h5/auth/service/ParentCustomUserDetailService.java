package com.h5.auth.service;

import com.h5.auth.model.ParentCustomUserDetails;
import com.h5.parent.repository.ParentUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ParentCustomUserDetailService implements UserDetailsService {

    private final ParentUserRepository parentUserRepository;

    public ParentCustomUserDetailService(ParentUserRepository parentUserRepository) {
        this.parentUserRepository = parentUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return parentUserRepository.findByEmailAndDeleteDttmIsNull(email)
                .map(ParentCustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
