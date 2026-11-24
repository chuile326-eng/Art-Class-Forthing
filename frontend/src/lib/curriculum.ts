// Built-in curriculum content (authored for this platform, not copied from
// commercial courses). Used as an honest offline fallback when the backend
// API is unreachable; pages label it as such. When the API is up, API data wins.
import type { Lesson, Module } from './api';

export interface LocalLesson extends Lesson {
  theory: string; correctExample: string; wrongExample: string; steps: string[];
  demoStrokes?: { x: number; y: number }[][];
  exerciseTitle: string; exerciseInstructions: string;
}
export interface LocalModule extends Module { lessons: LocalLesson[] }

const L = (id: string, title: string, desc: string, diff: string, mins: number, theory: string, steps: string[]): LocalLesson => ({
  id, title, description: desc, difficulty: diff, duration_minutes: mins, theory,
  correctExample: 'Đường nét đều tay, dứt khoát, giữ đúng hướng và tỉ lệ đã định.',
  wrongExample: 'Nét run, ngắt quãng, lệch hướng hoặc đè tay quá mạnh ở một đoạn.',
  steps,
  objectives: ['Hiểu nguyên tắc cốt lõi của bài', 'Thực hành theo từng bước có kiểm soát', 'Tự đánh giá và sửa lỗi của mình'],
  prerequisites: [],
  rubric: [
    { name: 'Độ chính xác', description: 'Đúng hình, đúng tỉ lệ, đúng hướng', weight: 35, max_score: 100 },
    { name: 'Độ mượt của nét', description: 'Nét liền mạch, không run', weight: 25, max_score: 100 },
    { name: 'Cấu trúc', description: 'Dựng hình đúng logic khối', weight: 25, max_score: 100 },
    { name: 'Hoàn thiện yêu cầu', description: 'Làm đủ các bước của bài', weight: 15, max_score: 100 },
  ],
  exerciseTitle: `Bài luyện: ${title}`,
  exerciseInstructions: 'Vẽ theo các bước trong bài, nộp bài để AI chấm theo rubric. Bạn có thể nộp lại nhiều lần.',
});

export const TRACKS = [
  { id: 'portrait', name: 'Chân dung', description: 'Dựng đầu, tỉ lệ khuôn mặt, ánh sáng trên da và biểu cảm.', prerequisites: ['Module 00', 'Module 02', 'Module 03', 'Module 06', 'Module 08'] },
  { id: 'anime', name: 'Anime & Manga', description: 'Đường nét manga, khuôn mặt anime, tư thế và biểu cảm nhân vật.', prerequisites: ['Module 01', 'Module 02', 'Module 08', 'Module 09'] },
  { id: 'landscape', name: 'Phong cảnh & Môi trường', description: 'Phối cảnh không gian, cây cối, kiến trúc và ánh sáng ngoài trời.', prerequisites: ['Module 03', 'Module 04', 'Module 06', 'Module 09'] },
  { id: 'digital', name: 'Digital Painting', description: 'Cọ số, lớp màu, ánh sáng và hoàn thiện tranh minh họa số.', prerequisites: ['Module 06', 'Module 07', 'Module 09', 'Module 10'] },
];

export const MODULES: LocalModule[] = [
  { id: 'M00', name: 'Module 00 — Nền tảng vẽ', title: 'Nền tảng vẽ', description: 'Dụng cụ, tư thế cầm bút, lực tay và cách quan sát.', difficulty: 'Cơ bản', lessons: [
    L('L00-01', 'Dụng cụ và vật liệu', 'Bút chì, giấy, tẩy — chọn đúng đồ cho từng bài.', 'Cơ bản', 15, 'Bút chì có nhiều độ cứng: H cứng nhạt, B mềm đậm. Giấy nhám giữ chì tốt hơn giấy trơn. Hãy thử vẽ cùng một nét bằng 2B, 4B và 6B để cảm nhận độ đậm.', ['Chuẩn bị 3 cây bút chì 2B, 4B, 6B', 'Vẽ một đường thẳng bằng mỗi bút', 'So sánh độ đậm và độ mịn']),
    L('L00-02', 'Tư thế cầm bút', 'Cầm bút đúng giúp nét dài, mượt và ít mỏi tay.', 'Cơ bản', 15, 'Cầm bút bằng ba ngón, cổ tay thả lỏng, vẽ bằng chuyển động của cả cánh tay thay vì chỉ ngón tay khi cần nét dài.', ['Cầm bút, thả lỏng vai', 'Vẽ nét dài từ vai, không chỉ cổ tay', 'Thử nét ngắn bằng ngón tay để so sánh']),
    L('L00-03', 'Lực tay và độ đậm nhạt', 'Điều khiển lực tay để tạo sắc độ.', 'Cơ bản', 20, 'Cùng một cây bút, lực nhẹ cho nét nhạt, lực mạnh cho nét đậm. Luyện thang sắc độ từ nhạt tới đậm trong 5 ô.', ['Vẽ 5 ô vuông', 'Tô mỗi ô một sắc độ tăng dần', 'Giữ chuyển sắc đều, không vệt']),
    L('L00-04', 'Cách quan sát', 'Nhìn đúng trước khi vẽ: so sánh, đo tỉ lệ bằng mắt.', 'Cơ bản', 20, 'Quan sát bằng cách nheo mắt để thấy khối sáng tối, dùng bút chì giơ thẳng để đo tỉ lệ tương đối giữa các phần.', ['Chọn một vật đơn giản', 'Đo chiều cao và chiều rộng bằng bút', 'Phác khung bao trước khi vẽ chi tiết']),
    L('L00-05', 'Bài đánh giá đầu vào', 'Bài kiểm tra ngắn để biết điểm bắt đầu của bạn.', 'Cơ bản', 25, 'Vẽ một đường thẳng, một hình tròn, một hình khối đơn giản và một vật quan sát. Không cần đẹp — bài này chỉ để đo xuất phát điểm.', ['Vẽ đường thẳng dài 10cm', 'Vẽ hình tròn không dùng compa', 'Vẽ một chiếc cốc quan sát']),
  ]},
  { id: 'M01', name: 'Module 01 — Kiểm soát nét', title: 'Kiểm soát nét', description: 'Nét thẳng, cong, tròn, ellipse — nền tảng của mọi hình vẽ.', difficulty: 'Cơ bản', lessons: [
    L('L01-01', 'Nét thẳng', 'Vẽ nét thẳng dài, đều và dứt khoát.', 'Cơ bản', 15, 'Vẽ nét thẳng bằng chuyển động của cánh tay, mắt nhìn điểm đích chứ không nhìn đầu bút. Nét tốt là nét đi thẳng tới đích trong một lần kéo.', ['Chấm hai điểm cách nhau 10cm', 'Kéo một nét nối hai điểm', 'Lặp lại 10 lần, so sánh độ lệch']),
    L('L01-02', 'Nét cong', 'Đường cong mượt, đều độ cong.', 'Cơ bản', 15, 'Đường cong tốt có độ cong thay đổi từ từ, không gãy khúc. Xoay giấy để tay ở tư thế thoải mái nhất.', ['Vẽ cung tròn lớn', 'Vẽ đường cong hình chữ S', 'Giữ tốc độ đều tay']),
    L('L01-03', 'Đường tròn', 'Vẽ tròn bằng chuyển động cổ tay và cánh tay.', 'Cơ bản', 20, 'Vẽ tròn bằng nhiều vòng chồng nhau rồi chọn vòng đẹp nhất — đó là cách họa sĩ luyện, không phải vẽ một vòng duy nhất.', ['Vẽ 5 vòng tròn chồng nhau', 'Chọn vòng tròn nhất', 'Thu nhỏ dần kích thước']),
    L('L01-04', 'Ellipse', 'Ellipse là chìa khóa để vẽ khối trụ và vật tròn trong phối cảnh.', 'Cơ bản', 20, 'Ellipse có trục dài và trục ngắn; độ dẹt thay đổi theo góc nhìn. Vẽ ellipse bằng hai vòng chồng, giữ trục đối xứng.', ['Vẽ ellipse ngang', 'Vẽ ellipse dọc', 'Thay đổi độ dẹt từ 0.3 tới 0.8']),
    L('L01-05', 'Nét song song và liên tục', 'Giữ khoảng cách đều giữa các nét.', 'Cơ bản', 15, 'Nét song song dùng để tô bóng (hatching). Giữ khoảng cách và hướng nhất quán, không để nét chéo nhau vô ý.', ['Tô 5 nét song song', 'Tô vùng chuyển sắc bằng nét song song', 'Đổi hướng 45 độ và lặp lại']),
  ]},
  { id: 'M02', name: 'Module 02 — Hình & Tỉ lệ', title: 'Hình & Tỉ lệ', description: 'Hình 2D, đường bao, tỉ lệ, đối xứng và negative space.', difficulty: 'Cơ bản', lessons: [
    L('L02-01', 'Hình học 2D', 'Vuông, tròn, tam giác — mọi vật đều phân rã được thành hình đơn giản.', 'Cơ bản', 15, 'Trước khi vẽ chi tiết, hãy nhìn vật như tổ hợp hình 2D. Một chiếc cốc là hình chữ nhật cộng ellipse.', ['Phân rã một chiếc cốc thành hình 2D', 'Phân rã một chiếc ghế', 'Vẽ lại chỉ bằng hình đơn giản']),
    L('L02-02', 'Tỉ lệ', 'So sánh kích thước tương đối, không đoán mò.', 'Cơ bản', 20, 'Tỉ lệ đúng đến từ đo: chiều cao gấp mấy lần chiều rộng? Dùng bút chì làm thước đo tương đối.', ['Đo tỉ lệ chai nước', 'Vẽ lại đúng tỉ lệ đã đo', 'Kiểm tra bằng cách đo lại trên bài']),
    L('L02-03', 'Đối xứng', 'Tìm trục đối xứng trước khi vẽ chi tiết.', 'Cơ bản', 15, 'Hầu hết vật đối xứng đều có trục giữa. Vẽ trục trước, vẽ hai bên cân nhau.', ['Vẽ trục đối xứng của chiếc bình', 'Vẽ nửa trái rồi đối chiếu nửa phải', 'Sửa phần lệch']),
    L('L02-04', 'Negative Space', 'Vẽ khoảng trống quanh vật để thấy hình đúng hơn.', 'Cơ bản', 20, 'Đôi khi vẽ khoảng trống giữa các vật dễ hơn vẽ chính vật đó. Negative space giúp kiểm tra tỉ lệ.', ['Vẽ khoảng trống giữa hai chiếc cốc', 'So sánh với hình vật', 'Dùng negative space để sửa tỉ lệ']),
    L('L02-05', 'Phân rã hình phức tạp', 'Chia vật phức tạp thành các phần nhỏ.', 'Cơ bản', 20, 'Một chiếc xe đạp là hai vòng tròn, khung tam giác và tay lái. Phân rã trước, chi tiết sau.', ['Chọn một vật phức tạp', 'Liệt kê các hình thành phần', 'Vẽ khung phân rã rồi mới thêm chi tiết']),
  ]},
  { id: 'M03', name: 'Module 03 — Dựng hình khối', title: 'Dựng hình khối', description: 'Khối hộp, cầu, trụ, nón — tư duy 3D.', difficulty: 'Trung bình', lessons: [
    L('L03-01', 'Khối hộp (Cube)', 'Dựng hộp bằng các cạnh song song và góc đúng.', 'Trung bình', 20, 'Khối hộp có 3 mặt thấy được, các cạnh song song hội tụ về điểm tụ. Vẽ hộp bằng khung dây trước.', ['Vẽ khung hộp', 'Thêm mặt sáng tối', 'Xoay hộp sang góc khác']),
    L('L03-02', 'Hình cầu (Sphere)', 'Cầu: đường bao tròn, bóng đổ mềm theo độ cong.', 'Trung bình', 20, 'Hình cầu không có cạnh. Bóng chuyển từ sáng sang tối từ từ theo độ cong.', ['Vẽ đường bao tròn', 'Xác định hướng sáng', 'Tô bóng chuyển sắc mềm']),
    L('L03-03', 'Hình trụ (Cylinder)', 'Trụ = hai ellipse + hai đường thẳng.', 'Trung bình', 20, 'Ellipse trên và dưới của trụ phải có cùng độ dẹt khi nhìn ngang. Đây là lỗi thường gặp nhất.', ['Vẽ ellipse trên và dưới', 'Nối hai đường thẳng đứng', 'Kiểm tra độ dẹt hai ellipse']),
    L('L03-04', 'Hình nón (Cone)', 'Nón: đỉnh, đáy ellipse và đường bao thẳng.', 'Trung bình', 15, 'Đỉnh nón nằm trên trục giữa của đáy ellipse. Lệch trục là lỗi phổ biến.', ['Vẽ đáy ellipse', 'Xác định đỉnh trên trục giữa', 'Nối đường bao']),
    L('L03-05', 'Kết hợp khối', 'Dựng vật thể từ nhiều khối ghép lại.', 'Trung bình', 25, 'Chai lọ là trụ + cầu, nhà là hộp + chóp. Ghép khối đúng tỉ lệ là bước dựng hình thật.', ['Dựng chai bằng trụ và cầu', 'Dựng ngôi nhà bằng hộp và chóp', 'Thêm bóng đổ chung']),
  ]},
  { id: 'M04', name: 'Module 04 — Phối cảnh', title: 'Phối cảnh', description: 'Đường chân trời, điểm tụ, phối cảnh 1-2-3 điểm.', difficulty: 'Trung bình', lessons: [
    L('L04-01', 'Đường chân trời & điểm tụ', 'Mọi đường song song đều hội tụ về một điểm trên đường chân trời.', 'Trung bình', 20, 'Đường chân trời ngang tầm mắt người nhìn. Điểm tụ là nơi các đường song song gặp nhau.', ['Vẽ đường chân trời', 'Chấm điểm tụ', 'Kéo các đường hội tụ']),
    L('L04-02', 'Phối cảnh một điểm tụ', 'Vẽ phòng, hành lang bằng một điểm tụ.', 'Trung bình', 25, 'Mặt trước song song với mặt phẳng tranh, các cạnh sâu hội tụ về điểm tụ duy nhất.', ['Vẽ khung phòng', 'Thêm cửa và cửa sổ theo điểm tụ', 'Kiểm tra mọi đường sâu đều về điểm tụ']),
    L('L04-03', 'Phối cảnh hai điểm tụ', 'Vẽ góc nhà, khối hộp xoay bằng hai điểm tụ.', 'Trung bình', 25, 'Khi hộp xoay, hai bộ cạnh ngang hội tụ về hai điểm tụ khác nhau trên đường chân trời.', ['Vẽ hộp xoay 45 độ', 'Xác định hai điểm tụ', 'Vẽ thêm hộp thứ hai cùng hệ điểm tụ']),
    L('L04-04', 'Phối cảnh ba điểm tụ', 'Nhìn từ trên cao hoặc dưới thấp.', 'Trung bình', 25, 'Thêm điểm tụ thứ ba cho các cạnh đứng khi nhìn lên cao hoặc xuống thấp.', ['Vẽ tòa nhà nhìn từ dưới lên', 'Xác định điểm tụ đứng', 'Giữ các cạnh đứng hội tụ nhẹ']),
    L('L04-05', 'Foreshortening — rút ngắn', 'Vật hướng về phía người nhìn bị rút ngắn.', 'Trung bình', 25, 'Một cánh tay chĩa về phía người nhìn trông ngắn hơn thật. Vẽ đúng độ rút ngắn bằng cách đo tỉ lệ nhìn thấy.', ['Vẽ cánh tay chĩa tới', 'Đo tỉ lệ rút ngắn', 'So sánh với tư thế duỗi ngang']),
  ]},
  { id: 'M05', name: 'Module 05 — Vẽ quan sát', title: 'Vẽ quan sát', description: 'Đo tỉ lệ bằng mắt, vẽ tĩnh vật từ quan sát thật.', difficulty: 'Trung bình', lessons: [
    L('L05-01', 'Đo tỉ lệ bằng mắt', 'Dùng bút chì làm thước đo tương đối.', 'Trung bình', 20, 'Giơ bút thẳng tay, nhắm một mắt, đo chiều cao vật rồi so với chiều rộng.', ['Đo một chai lọ', 'Ghi tỉ lệ ra giấy', 'Vẽ khung theo tỉ lệ đã đo']),
    L('L05-02', 'So sánh góc', 'Đo góc nghiêng bằng bút chì.', 'Trung bình', 20, 'Đặt bút theo cạnh nghiêng của vật, giữ nguyên góc đó rồi đặt lên giấy để so sánh.', ['Đo góc nghiêng của quai ấm', 'Vẽ lại góc đó', 'Kiểm tra bằng bút']),
    L('L05-03', 'Tĩnh vật: chai lọ', 'Vẽ chai lọ: trục, đối xứng, ellipse miệng chai.', 'Trung bình', 25, 'Chai lọ đối xứng qua trục giữa. Miệng chai là ellipse, thân là đường cong đối xứng.', ['Vẽ trục giữa', 'Vẽ ellipse miệng chai', 'Vẽ thân đối xứng hai bên']),
    L('L05-04', 'Tĩnh vật: hoa quả', 'Vẽ quả táo, quả cam: khối cầu biến dạng.', 'Trung bình', 25, 'Hoa quả không phải cầu hoàn hảo — có chỗ lõm, chỗ lồi. Quan sát đường bao thật kỹ.', ['Vẽ đường bao quả táo', 'Thêm cuống và chỗ lõm', 'Tô bóng theo hướng sáng']),
    L('L05-05', 'Tĩnh vật tổng hợp', 'Ghép nhiều vật trong một bố cục.', 'Trung bình', 30, 'Sắp xếp 3 vật: vật cao sau, vật thấp trước, tạo chiều sâu bằng chồng lấp.', ['Sắp xếp bố cục 3 vật', 'Vẽ khung bao toàn cảnh', 'Vẽ từng vật theo thứ tự xa gần']),
  ]},
  { id: 'M06', name: 'Module 06 — Ánh sáng & Bóng đổ', title: 'Ánh sáng & Bóng đổ', description: 'Thang giá trị, bóng lõi, bóng đổ, ánh sáng phản chiếu.', difficulty: 'Trung bình', lessons: [
    L('L06-01', 'Thang giá trị (Value Scale)', 'Từ trắng tới đen qua 5-9 nấc.', 'Trung bình', 15, 'Giá trị (value) là độ sáng tối, tách biệt với màu sắc. Luyện thang 5 nấc trước.', ['Vẽ thang 5 nấc', 'Tô đều từng nấc', 'So sánh nấc kề nhau']),
    L('L06-02', 'Nguồn sáng & vùng sáng', 'Xác định hướng sáng trước khi tô bóng.', 'Trung bình', 20, 'Vùng sáng (highlight) nằm phía nguồn sáng, vùng tối ngược lại. Không tô bóng trước khi biết hướng sáng.', ['Chọn hướng sáng', 'Đánh dấu vùng highlight', 'Tô vùng tối đối diện']),
    L('L06-03', 'Bóng lõi & bóng đổ', 'Bóng lõi trên vật, bóng đổ trên mặt đất.', 'Trung bình', 20, 'Bóng lõi (core shadow) là vùng tối nhất trên vật, bóng đổ (cast shadow) là bóng vật hắt xuống mặt phẳng.', ['Vẽ khối cầu có bóng lõi', 'Vẽ bóng đổ theo hướng sáng', 'Bóng đổ mờ dần ở rìa xa']),
    L('L06-04', 'Ánh sáng phản chiếu', 'Mặt đất hắt sáng lên vùng tối của vật.', 'Trung bình', 20, 'Vùng tối không đen đặc — có ánh sáng phản chiếu từ mặt đất làm nó sáng lên một chút.', ['Tô bóng lõi', 'Thêm dải sáng phản chiếu ở mép dưới', 'Giữ dải này nhạt hơn vùng sáng']),
    L('L06-05', 'Tô bóng trên khối', 'Áp dụng toàn bộ kiến thức sáng tối lên khối hộp, cầu, trụ.', 'Trung bình', 25, 'Mỗi khối có cách chuyển sắc khác nhau: cầu mềm, hộp sắc cạnh, trụ chuyển đều.', ['Tô bóng khối cầu', 'Tô bóng khối hộp', 'Tô bóng khối trụ và so sánh']),
  ]},
  { id: 'M07', name: 'Module 07 — Chất liệu & Màu sắc', title: 'Chất liệu & Màu sắc', description: 'Gỗ, kim loại, thủy tinh, vải; bánh xe màu và hòa sắc.', difficulty: 'Trung bình', lessons: [
    L('L07-01', 'Vật liệu gỗ', 'Vân gỗ, độ nhám và sắc độ ấm.', 'Trung bình', 20, 'Gỗ có vân dọc theo thớ, sắc độ ấm, bề mặt nhám nên bóng không gắt.', ['Vẽ vân gỗ theo thớ', 'Tô sắc độ ấm', 'Thêm vết xước nhẹ']),
    L('L07-02', 'Kim loại & thủy tinh', 'Phản chiếu mạnh, vùng sáng gắt và sắc cạnh.', 'Trung bình', 20, 'Kim loại phản chiếu môi trường xung quanh; thủy tinh trong suốt, chỉ thấy qua viền và điểm sáng.', ['Vẽ thìa kim loại', 'Vẽ ly thủy tinh bằng viền sáng', 'Giữ vùng sáng trắng sắc nét']),
    L('L07-03', 'Vải', 'Nếp gấp: nếp căng, nếp rủ, nếp xoắn.', 'Trung bình', 20, 'Nếp vải tạo bởi lực kéo và trọng lực. Vẽ nếp bằng đường cong mềm và bóng chuyển dần.', ['Vẽ nếp rủ', 'Vẽ nếp căng ở góc', 'Tô bóng trong nếp gấp']),
    L('L07-04', 'Bánh xe màu', 'Hue, Saturation, Value và quan hệ màu.', 'Trung bình', 20, 'Màu đối nhau (bổ túc) làm nhau nổi bật; màu kề nhau tạo hòa sắc êm.', ['Vẽ bánh xe màu 12 màu', 'Tìm cặp màu bổ túc', 'Pha màu trung tính bằng cặp bổ túc']),
    L('L07-05', 'Hòa sắc & ánh sáng màu', 'Màu ấm/lạnh và màu của ánh sáng.', 'Trung bình', 25, 'Ánh sáng ấm làm vùng sáng ấm và bóng lạnh, và ngược lại. Đây là chìa khóa tô màu có chiều sâu.', ['Tô khối cầu dưới ánh sáng ấm', 'Tô cùng khối dưới ánh sáng lạnh', 'So sánh cảm giác']),
  ]},
  { id: 'M08', name: 'Module 08 — Dáng & Giải phẫu', title: 'Dáng & Giải phẫu', description: 'Gesture, tỉ lệ cơ thể, đầu, tay, chân và tư thế động.', difficulty: 'Nâng cao', lessons: [
    L('L08-01', 'Gesture — đường dáng', 'Nắm bắt chuyển động bằng một đường duy nhất.', 'Nâng cao', 20, 'Gesture là đường hành động (line of action) chạy qua cơ thể, thể hiện hướng chuyển động.', ['Vẽ line of action cho tư thế chạy', 'Vẽ cho tư thế ngồi', 'Giới hạn mỗi dáng trong 30 giây']),
    L('L08-02', 'Tỉ lệ cơ thể', 'Người trưởng thành cao khoảng 7.5 đầu.', 'Nâng cao', 25, 'Dùng đơn vị "đầu" để đo: thân khoảng 3 đầu, chân khoảng 4 đầu.', ['Vẽ khung người 7.5 đầu', 'Đánh dấu các mốc khớp', 'Vẽ tư thế đứng thẳng']),
    L('L08-03', 'Dựng đầu', 'Hộp sọ + hàm, trục mặt, vị trí mắt mũi miệng.', 'Nâng cao', 25, 'Đầu là hình cầu cắt phẳng hai bên cộng hàm. Mắt nằm ở giữa chiều cao đầu.', ['Vẽ khối cầu đầu', 'Thêm mặt phẳng hai bên', 'Đặt mắt ở đường giữa']),
    L('L08-04', 'Tay & chân', 'Bàn tay: lòng bàn tay + ngón; bàn chân: gót + vòm.', 'Nâng cao', 25, 'Tay khó vì nhiều khớp. Vẽ bàn tay như một khối dẹt, ngón tay là các trụ nhỏ.', ['Vẽ bàn tay xòe', 'Vẽ bàn tay nắm', 'Vẽ bàn chân nghiêng']),
    L('L08-05', 'Tư thế động', 'Ghép gesture, tỉ lệ và khối thành dáng động.', 'Nâng cao', 30, 'Tư thế động cần đường dáng mạnh, trọng tâm rõ và các chi đối xứng theo chuyển động.', ['Vẽ dáng nhảy', 'Vẽ dáng cúi người', 'Kiểm tra trọng tâm và thăng bằng']),
  ]},
  { id: 'M09', name: 'Module 09 — Bố cục & Kể chuyện', title: 'Bố cục & Kể chuyện', description: 'Điểm nhấn, cân bằng, nhịp điệu và kể chuyện bằng hình.', difficulty: 'Nâng cao', lessons: [
    L('L09-01', 'Điểm nhấn (Focal Point)', 'Mắt người xem cần một nơi để dừng lại đầu tiên.', 'Nâng cao', 20, 'Tạo điểm nhấn bằng tương phản sáng tối, kích thước hoặc màu sắc.', ['Chọn điểm nhấn cho một cảnh', 'Làm nổi bật bằng tương phản', 'Giảm chi tiết ở vùng phụ']),
    L('L09-02', 'Cân bằng & nhịp điệu', 'Cân bằng đối xứng và bất đối xứng.', 'Nâng cao', 20, 'Bố cục cân bằng khi "trọng lượng thị giác" hai bên tương đương, dù hình không đối xứng.', ['Vẽ bố cục đối xứng', 'Vẽ bố cục bất đối xứng cân bằng', 'So sánh cảm giác']),
    L('L09-03', 'Thumbnail sketch', 'Phác bố cục nhỏ trước khi vẽ lớn.', 'Nâng cao', 20, 'Thumbnail 5x7cm giúp thử nhiều bố cục nhanh trước khi đầu tư vào bản lớn.', ['Vẽ 4 thumbnail khác nhau', 'Chọn bố cục tốt nhất', 'Phóng to bố cục đã chọn']),
    L('L09-04', 'Chiều sâu trong bố cục', 'Xa gần, chồng lấp, mờ nhạt tạo chiều sâu.', 'Nâng cao', 20, 'Vật gần lớn, đậm, chi tiết; vật xa nhỏ, nhạt, ít chi tiết.', ['Vẽ cảnh có 3 lớp xa gần', 'Làm mờ lớp xa', 'Thêm vật tiền cảnh']),
    L('L09-05', 'Kể chuyện bằng hình', 'Một bức tranh kể được một khoảnh khắc.', 'Nâng cao', 25, 'Kể chuyện bằng tư thế, biểu cảm, bối cảnh và chi tiết gợi mở — không cần chữ.', ['Chọn một khoảnh khắc để kể', 'Vẽ thumbnail kể chuyện', 'Thêm chi tiết gợi mở']),
  ]},
  { id: 'M10', name: 'Module 10 — Vẽ nâng cao', title: 'Vẽ nâng cao', description: 'Dựng hình phức tạp, giải phẫu nâng cao, dự án tổng kết.', difficulty: 'Nâng cao', lessons: [
    L('L10-01', 'Dựng hình phức tạp', 'Ghép nhiều khối trong phối cảnh thống nhất.', 'Nâng cao', 25, 'Vật phức tạp vẫn là tổ hợp khối — giữ chung một hệ điểm tụ.', ['Dựng xe đạp từ khối', 'Dựng bàn ghế trong phòng', 'Kiểm tra chung điểm tụ']),
    L('L10-02', 'Giải phẫu nâng cao', 'Cơ, xương và chuyển động.', 'Nâng cao', 25, 'Hiểu cơ giúp vẽ dáng động thuyết phục: cơ căng ở phía co, giãn ở phía đối diện.', ['Vẽ cánh tay co duỗi', 'Đánh dấu nhóm cơ chính', 'Vẽ dáng vặn người']),
    L('L10-03', 'Ánh sáng phức tạp', 'Nhiều nguồn sáng, ánh sáng xuyên vật.', 'Nâng cao', 25, 'Hai nguồn sáng tạo hai hệ bóng; cần chọn một nguồn chính.', ['Vẽ vật dưới hai nguồn sáng', 'Chọn nguồn chính', 'Làm bóng phụ nhạt hơn']),
    L('L10-04', 'Vẽ theo reference', 'Dùng ảnh tham khảo mà không sao chép máy móc.', 'Nâng cao', 25, 'Reference để hiểu cấu trúc, không phải để đồ lại từng chi tiết.', ['Chọn một ảnh reference', 'Phân tích cấu trúc', 'Vẽ lại theo hiểu biết của mình']),
    L('L10-05', 'Dự án tổng kết (Capstone)', 'Một bức minh họa hoàn chỉnh từ ý tưởng tới hoàn thiện.', 'Nâng cao', 60, 'Capstone: chọn chủ đề, thumbnail, dựng hình, tô bóng/màu và hoàn thiện. Nộp để AI chấm tổng thể.', ['Viết ý tưởng một câu', 'Vẽ 3 thumbnail', 'Hoàn thiện bức tranh cuối']),
  ]},
];

export const ALL_LESSONS: LocalLesson[] = MODULES.flatMap(m => m.lessons.map(l => ({ ...l, module_id: m.id })));
export function findLesson(id: string): LocalLesson | undefined { return ALL_LESSONS.find(l => String(l.id) === String(id)); }
export function findModule(id: string): LocalModule | undefined { return MODULES.find(m => String(m.id) === String(id)); }
export function nextLesson(id: string): LocalLesson | undefined {
  const i = ALL_LESSONS.findIndex(l => String(l.id) === String(id));
  return i >= 0 && i < ALL_LESSONS.length - 1 ? ALL_LESSONS[i + 1] : undefined;
}
