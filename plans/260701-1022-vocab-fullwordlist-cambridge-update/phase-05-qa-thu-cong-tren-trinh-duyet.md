---
phase: 5
title: "QA thu cong tren trinh duyet"
status: completed
priority: P2
dependencies: [4]
---

# Phase 5: QA thu cong tren trinh duyet

## Overview

Repo khong co test suite tu dong (tien le tu plan truoc `260701-0837-english-vocab-subject`) — phase nay la buoc kiem chung cuoi cung bang tay truoc khi coi plan hoan tat, tap trung vao regression cho ca Toan lan Tieng Anh, va chat luong noi dung (ban dich, phat am TTS) cho du lieu moi mo rong.

## Requirements

- Functional: khong regression cho luong Toan hien co; luong Tieng Anh (ca 2 cap) hoat dong dung voi vocab pool moi
- Non-functional: khong co yeu cau hieu nang dac biet (vai nghin object JS o client la khong dang ke)

## Related Code Files

- Khong sua code trong phase nay (tru khi phat hien bug can fix nhanh — neu co, ghi lai va fix truc tiep, cap nhat lai Success Criteria phase truoc do neu can)

## Implementation Steps

1. Mo app, chon be lop 1 → chon mon Toan → lam vai cau → xac nhan khong regression (streak/sao tinh dung nhu truoc).
2. Doi mon sang Tieng Anh (nut "Doi mon") → lam it nhat 15-20 cau moi loai (MC EN→VN, MC VN→EN, listen-choose) → kiem tra:
   - Cau hoi hien thi dung tu + nghia
   - TTS (nut loa) doc dung tu tieng Anh moi (dac biet cum tu nhieu chu, tu co ky tu dac biet neu co nhu dau gach ngang, dau ngoac)
   - Dap an dung duoc cham dung, dap an sai bi tru sao dung
   - Streak/sao gop chung voi Toan (khong co counter rieng)
3. Lap lai buoc 2 cho be lop 4, them kiem tra rieng dang Spelling (cham cum tu nhieu chu nhu "have breakfast", dam bao khoang trang duoc xu ly dung nhu hanh vi cu).
4. Sample ban dich theo 2 lop (finding tu red-team: sample % thuan tuy khong dam bao moi FILE deu duoc kiem, 1 file loi he thong ca the bi bo sot hoan toan neu roi vao 80-85% khong duoc chon):
   - **Theo % tong the**: random sample 15-20% tu moi (uu tien lay deu tu nhieu category khac nhau) → doi chieu ban dich voi tu dien/nghia thuc te, xac nhan khong co loi dich ro rang.
   - **Theo file (bat buoc, toi thieu)**: voi MOI file part `.js` da tao o Phase 2/3 (uoc tinh 15-25 file cho A2 Key), kiem tra it nhat 5-8 tu ngau nhien tu chinh file do — dam bao khong co file nao bi bo sot hoan toan chi vi random sample tong the khong roi trung vao no.
5. Kiem tra nut loa (TTS) tu an neu `window.speechSynthesis` khong kha dung — hanh vi da co san tu plan truoc, chi xac nhan khong bi regression.
6. Kiem tra tren it nhat 1 trinh duyet mobile-size (resize hoac DevTools device toolbar) vi day la app cho tre dung tren tablet/dien thoai theo boi canh du kien.
7. Neu phat hien loi dich hoac bug nho, sua truc tiep trong file part lien quan (Phase 2/3), khong can quay lai toan bo phase.

## Success Criteria

- [ ] Toan Toan van hoat dong dung 100% nhu truoc khi co plan nay (regression-free)
- [ ] Ca 2 cap Tieng Anh sinh cau hoi dung, cham diem dung, TTS hoat dong (hoac an dung khi khong ho tro)
- [ ] Streak/sao gop chung dung nhu thiet ke, khong co counter rieng cho Tieng Anh
- [ ] Sample 15-20% ban dich moi (tong the) duoc doi chieu, khong phat hien loi nghia ro rang
- [ ] Da kiem it nhat 5-8 tu tu MOI file part rieng le (khong chi dua vao sample tong the) — khong co file nao bi bo qua hoan toan
- [ ] Khong loi console trong suot qua trinh test tren ca 2 cap va ca 2 mon
- [ ] Rui ro chat luong dich con lai (ngoai pham vi sample) duoc ghi nhan ro la **residual risk da duoc chap nhan** (xem plan.md → Red Team Review), khong phai bi bo sot vo tinh

## Risk Assessment

- **Risk**: khong co test tu dong nen loi co the lot qua neu QA lam qua nhanh/hoi hot voi khoi luong tu lon (700-1000+ tu A2 Key). **Mitigation**: buoc 4 yeu cau sample ngau nhien tu nhieu category (khong chi test category dau tien roi dung lai), uu tien random thay vi tuan tu, VA sample toi thieu theo tung file (khong chi theo %) de tranh 1 file loi he thong bi bo sot hoan toan (finding tu red-team — voi 15-25 file/A2 Key, sample % thuan tuy co xac suat dang ke bo qua hoan toan 1 file).
- **Risk**: loi chi xuat hien voi tu/cum tu cu the (vd cum tu co dau nhay don nhu "mouse/mice" tu wordlist goc, hoac tu co ky tu dac biet) co the khong duoc phat hien neu QA chi test ngau nhien. **Mitigation**: buoc 1 rieng, chu dong tim vai tu "kho" (cum tu, ky tu dac biet) trong danh sach moi va test rieng cac tu do.
- **Risk (chap nhan, tu red-team)**: success criteria "ban dich tu nhien, dung nghia" khong the do luong khach quan bang QA thu cong mau — mot phan dich thuat co the co loi he thong ma khong bi phat hien qua sample. **Mitigation**: day la **rui ro con lai da duoc chap nhan** boi quyet dinh cua user (100% wordlist chinh thuc + khong co test suite tu dong trong repo) — khong chan tien do plan, nhung ghi nhan ro de khong hieu nham la "sample = dam bao 100% dung".
