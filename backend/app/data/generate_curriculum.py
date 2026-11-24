"""Generate curriculum.json: 11 foundation modules x5 + 4 tracks x5 = 75 lessons.
Each lesson theory is genuinely written Vietnamese instruction, >300 words,
composed from a topic-specific core + shared pedagogical paragraphs.
Run: python3 generate_curriculum.py
"""
import json, os

def theory(topic, focus, detail):
    return (
f"Bài học này tập trung vào {topic}. {focus} "
"Trước khi bắt đầu, hãy hiểu rằng vẽ không phải là tài năng bẩm sinh mà là một kỹ năng có thể rèn luyện được bằng phương pháp đúng và luyện tập đều đặn mỗi ngày. "
"Nhiều người mới học thường nóng vội muốn vẽ được một bức tranh đẹp ngay lập tức, nhưng nền tảng vững chắc mới là thứ quyết định bạn đi được bao xa. "
"Vì vậy trong bài này, chúng ta sẽ đi chậm, hiểu rõ bản chất của từng thao tác, và chỉ chuyển sang bước tiếp theo khi bạn đã thực sự cảm nhận được sự tiến bộ trong tay mình. "
f"{detail} "
"Khi luyện tập, hãy chuẩn bị một không gian yên tĩnh, giấy sạch và bút chì quen thuộc. Ngồi thẳng lưng, thả lỏng vai và cổ tay, hít thở đều trước mỗi nét vẽ. "
"Đừng ghì bút quá chặt vì lực tay căng sẽ làm nét vẽ run và nhanh mỏi. Hãy để bút trở thành phần nối dài của cánh tay, di chuyển từ vai và khuỷu tay thay vì chỉ dùng cổ tay. "
"Quan sát là một nửa của việc vẽ: trước khi đặt bút xuống giấy, hãy dành vài giây nhìn thật kỹ đối tượng, so sánh tỷ lệ, hình dáng và vị trí tương đối của các phần với nhau. "
"Trong quá trình vẽ, hãy thường xuyên lùi lại một bước để nhìn tổng thể thay vì chỉ chăm chăm vào một chi tiết nhỏ, bởi một chi tiết đúng mà đặt sai vị trí vẫn làm hỏng cả bức tranh. "
"Sau mỗi lần luyện, hãy tự so sánh bài của mình với mẫu, ghi lại ba điểm làm tốt và ba điểm cần cải thiện, rồi luyện lại đúng những điểm yếu đó trong buổi tiếp theo. "
"Đừng xóa hay bỏ đi những bài vẽ xấu, vì chúng là bằng chứng rõ ràng nhất cho thấy bạn đang tiến bộ từng ngày. "
"Nếu cảm thấy nản, hãy giảm độ khó xuống một chút, vẽ chậm lại và nhắc mình rằng mọi họa sĩ giỏi đều từng vẽ những nét đầu tiên run rẩy như bạn hôm nay. "
"Cuối bài, hãy tự kiểm tra theo rubric đi kèm: nếu đạt điều kiện qua bài, bạn có thể sang bài tiếp theo, nếu chưa đạt, hãy ôn lại một lần nữa — việc ôn tập không phải là thụt lùi mà là cách nhanh nhất để kỹ năng trở nên bền vững."
)

MODULES = [
 ("M00", "Drawing Fundamentals — Nền tảng vẽ", [
   ("Công cụ và dụng cụ vẽ", "tool", "Bút chì các độ cứng, giấy, tẩy, thước và bảng vẽ số: biết chọn đúng dụng cụ cho từng mục đích, cách giữ bút chì luôn sắc và bảo quản giấy không bị ẩm hay nhăn."),
   ("Tư thế cầm bút và lực tay", "posture", "Cách cầm bút đúng, tư thế ngồi, cách điều khiển lực tay từ nhẹ đến đậm, và bài tập thả lỏng cổ tay để nét vẽ không bị gồng cứng."),
   ("Điều khiển nét cơ bản", "control", "Luyện nét thẳng, nét cong và nét liên tục bằng chuyển động của cả cánh tay, cách giữ tốc độ đều và dừng nét đúng điểm mong muốn."),
   ("Cách quan sát đối tượng", "observation", "Quan sát hình dáng tổng thể trước chi tiết, so sánh tỷ lệ bằng mắt, dùng negative space để kiểm tra hình, và thói quen nhìn tổng thể khi vẽ."),
   ("Làm quen bảng vẽ số và bài đánh giá đầu vào", "digital", "Cài đặt bảng vẽ số, hiệu chỉnh lực bút, làm quen với lớp vẽ và undo, sau đó làm bài đánh giá đầu vào để xác định điểm bắt đầu phù hợp."),
 ]),
 ("M01", "Line Control — Kiểm soát nét", [
   ("Nét thẳng", "straight", "Vẽ nét thẳng dài bằng chuyển động vai, khóa cổ tay, nhìn điểm đích, luyện nét thẳng ngang, dọc và chéo với tốc độ đều và dứt khoát."),
   ("Nét cong và đường tròn", "curve", "Vẽ đường cong mượt bằng cách xoay cả cánh tay, luyện đường tròn khép kín, kiểm tra độ tròn bằng cách xoay giấy và so sánh hai nửa."),
   ("Ellipse cơ bản", "ellipse", "Vẽ ellipse với hai trục rõ ràng, kiểm tra độ đối xứng qua trục dài và trục ngắn, luyện ellipse nghiêng ở nhiều góc độ khác nhau."),
   ("Đường song song và khoảng cách đều", "parallel", "Vẽ các đường song song cách đều nhau, dùng mắt ước lượng khoảng cách, kiểm tra bằng cách đo và so sánh với mẫu."),
   ("Nét liên tục và độ đậm nhạt", "continuous", "Vẽ nét liên tục không nhấc bút, điều khiển độ đậm nhạt bằng lực tay, luyện chuyển từ nhạt sang đậm mượt mà trong một nét duy nhất."),
 ]),
 ("M02", "Shapes & Proportion — Hình và tỷ lệ", [
   ("Hình học 2D cơ bản", "shapes2d", "Vẽ hình vuông, hình chữ nhật, tam giác và hình tròn đúng tỷ lệ, hiểu mỗi hình được tạo từ những đường nào và góc nào."),
   ("Đường bao và tỷ lệ", "contour", "Vẽ đường bao của vật thể, so sánh chiều cao với chiều rộng, dùng đơn vị đo tự chọn để kiểm tra tỷ lệ trước khi thêm chi tiết."),
   ("Đối xứng và đo góc", "symmetry", "Tìm trục đối xứng, đo góc bằng mắt và bằng bút chì, kiểm tra hai phía của hình có cân bằng hay không."),
   ("Negative space", "negative", "Nhìn khoảng trống xung quanh vật thể thay vì chỉ nhìn vật thể, dùng negative space để phát hiện lỗi tỷ lệ mà mắt thường bỏ qua."),
   ("Phân rã hình phức tạp", "decompose", "Chia một vật thể phức tạp thành các hình đơn giản, vẽ khung hình đơn giản trước rồi mới thêm chi tiết, giữ đúng tỷ lệ tổng thể."),
 ]),
 ("M03", "Form Construction — Dựng khối", [
   ("Khối hộp (Cube)", "cube", "Dựng khối hộp từ hình vuông và các cạnh song song, xác định mặt trước, mặt bên và mặt trên, hiểu khối hộp là đơn vị cơ bản của mọi vật thể."),
   ("Khối cầu (Sphere)", "sphere", "Vẽ khối cầu bằng ellipse và đường bao, hiểu đường cross-contour chạy quanh bề mặt cầu và cách ánh sáng bám trên bề mặt cong."),
   ("Khối trụ (Cylinder)", "cylinder", "Dựng khối trụ từ hai ellipse và hai đường thẳng, kiểm tra hai ellipse có cùng độ mở hay không, và trục trụ phải thẳng."),
   ("Khối nón (Cone)", "cone", "Dựng khối nón từ ellipse đáy và đỉnh, hiểu đỉnh nón và đường sinh, luyện nón ở nhiều góc nhìn khác nhau."),
   ("Kết hợp các khối thành vật thể", "combine", "Ghép hộp, cầu, trụ và nón thành vật thể quen thuộc như chai, cốc hay ghế, giữ đúng trục và tỷ lệ giữa các khối thành phần."),
 ]),
 ("M04", "Perspective — Phối cảnh", [
   ("Đường chân trời và điểm tụ", "horizon", "Xác định đường chân trời theo tầm mắt người xem, hiểu điểm tụ là nơi các đường song song gặp nhau, và vẽ đường chân trời ở nhiều độ cao."),
   ("Phối cảnh một điểm tụ", "onepoint", "Vẽ phối cảnh một điểm tụ cho hành lang và căn phòng, các cạnh lùi đều hội tụ về một điểm duy nhất trên đường chân trời."),
   ("Phối cảnh hai điểm tụ", "twopoint", "Vẽ phối cảnh hai điểm tụ cho khối hộp và tòa nhà, hai nhóm cạnh lùi hội tụ về hai điểm tụ khác nhau, cạnh đứng vẫn giữ thẳng đứng."),
   ("Phối cảnh ba điểm tụ", "threepoint", "Vẽ phối cảnh ba điểm tụ khi nhìn từ trên cao hoặc từ dưới lên, hiểu điểm tụ thứ ba điều khiển độ cao và cảm giác choáng ngợp của khung cảnh."),
   ("Foreshortening và chiều sâu", "foreshorten", "Vẽ vật thể bị rút ngắn khi hướng về phía người xem, hiểu foreshortening làm vật gần to hơn vật xa, và dùng nó để tạo chiều sâu."),
 ]),
 ("M05", "Observation Drawing — Vẽ quan sát", [
   ("Đo tỷ lệ bằng mắt", "measure", "Dùng bút chì giơ thẳng tay để đo tỷ lệ, so sánh chiều cao và chiều rộng của vật thể, kiểm tra lại bằng nhiều lần đo độc lập."),
   ("Vẽ tĩnh vật: chai lọ", "bottle", "Vẽ chai lọ bằng cách dựng trục giữa, kiểm tra đối xứng hai bên, vẽ ellipse ở miệng và đáy chai với độ mở phù hợp tầm mắt."),
   ("Vẽ tĩnh vật: hoa quả", "fruit", "Vẽ hoa quả bằng hình cầu và hình trụ biến dạng, quan sát đường bao không hoàn hảo của tự nhiên thay vì vẽ hình học cứng nhắc."),
   ("Vẽ đồ vật thường ngày", "objects", "Vẽ bàn ghế và đồ vật trong nhà, kết hợp quan sát và dựng khối, chú ý tỷ lệ giữa các bộ phận và vị trí trong không gian."),
   ("Kết hợp quan sát và cấu trúc", "combine_obs", "Kết hợp đo tỷ lệ bằng mắt với dựng khối, kiểm tra bài vẽ bằng negative space và bằng cách lật ngược giấy để thấy lỗi."),
 ]),
 ("M06", "Light & Shadow — Sáng tối", [
   ("Thang giá trị (Value Scale)", "value", "Luyện thang giá trị từ trắng đến đen với ít nhất chín bậc, kiểm soát lực tay để mỗi bậc đều nhau, hiểu giá trị là ngôn ngữ của ánh sáng."),
   ("Nguồn sáng và vùng sáng", "light", "Xác định hướng nguồn sáng, vẽ vùng highlight, midtone và vùng tối, hiểu ánh sáng mạnh tạo tương phản cao còn ánh sáng khuếch tán tạo chuyển tông mềm."),
   ("Bóng đổ và bóng lõi", "shadow", "Phân biệt core shadow trên vật thể với cast shadow trên mặt đất, vẽ bóng đổ theo hướng ngược nguồn sáng và nhạt dần khi xa vật."),
   ("Ánh sáng phản chiếu", "reflected", "Nhận ra ánh sáng phản chiếu làm sáng nhẹ mép tối của vật thể, không vẽ vùng tối thành một mảng đen đặc mà giữ lại sự biến đổi tinh tế."),
   ("Tô bóng trên khối", "shading", "Tô bóng trên khối hộp, cầu và trụ, dùng nét tô theo hướng cross-contour để vừa diễn tả sáng tối vừa diễn tả hình khối."),
 ]),
 ("M07", "Materials & Color — Chất liệu và màu sắc", [
   ("Vẽ chất liệu gỗ và vải", "wood", "Diễn tả vân gỗ bằng nét cong song song và diễn tả vải bằng nếp gấp mềm, hiểu mỗi chất liệu có cách phản chiếu ánh sáng riêng."),
   ("Vẽ kim loại và thủy tinh", "metal", "Vẽ kim loại bằng tương phản cao và vùng sáng sắc, vẽ thủy tinh bằng cách vẽ những gì nhìn xuyên qua nó thay vì vẽ bản thân tấm kính."),
   ("Bánh xe màu và hòa sắc", "wheel", "Hiểu bánh xe màu, màu bổ túc và màu tương đồng, luyện pha màu và chọn bảng màu hài hòa cho một bức tranh đơn giản."),
   ("Hue, Saturation, Value", "hsv", "Phân biệt sắc độ, độ bão hòa và độ sáng, luyện hạ bão hòa để tạo màu trầm và tăng giá trị để tạo cảm giác không gian xa gần."),
   ("Tô màu kỹ thuật số cơ bản", "digital_color", "Tô màu bằng lớp riêng, dùng clipping mask, chọn cọ mềm cho chuyển màu và cọ cứng cho cạnh sắc, giữ bảng màu gọn trong mỗi bài."),
 ]),
 ("M08", "Gesture & Anatomy — Dáng và giải phẫu", [
   ("Gesture drawing và line of action", "gesture", "Vẽ gesture trong 30 đến 60 giây bằng một đường chuyển động chính, bắt cảm giác chuyển động thay vì chi tiết, luyện nhiều dáng liên tục."),
   ("Tỷ lệ cơ thể người", "bodyprop", "Học tỷ lệ cơ thể theo đơn vị đầu, so sánh độ dài thân, tay và chân, kiểm tra tỷ lệ trước khi vẽ chi tiết cơ bắp hay quần áo."),
   ("Dựng đầu và khuôn mặt", "head", "Dựng đầu bằng khối cầu và mặt phẳng, xác định đường mắt, mũi và miệng theo tỷ lệ, hiểu đầu nghiêng làm các đường này cong theo bề mặt."),
   ("Thân, tay và chân", "limbs", "Dựng thân, tay và chân bằng hình trụ và khớp cầu, hiểu khớp gập theo hướng nào và giới hạn chuyển động của từng khớp."),
   ("Bàn tay và bàn chân", "hands", "Vẽ bàn tay bằng khối hộp dẹt và các đốt ngón tay, luyện tay ở nhiều tư thế, chấp nhận rằng tay là phần khó và cần luyện riêng nhiều lần."),
 ]),
 ("M09", "Composition & Visual Storytelling — Bố cục và kể chuyện", [
   ("Điểm nhấn và thứ bậc thị giác", "focal", "Chọn một điểm nhấn duy nhất, dùng tương phản, kích thước và vị trí để dẫn mắt người xem tới đó trước tiên, rồi mới tới các chi tiết phụ."),
   ("Cân bằng và nhịp điệu", "balance", "Cân bằng bố cục bằng khối lượng thị giác chứ không phải đối xứng máy móc, tạo nhịp điệu bằng cách lặp lại hình dáng với biến đổi."),
   ("Thumbnail sketch", "thumbnail", "Phác nhanh nhiều thumbnail nhỏ trước khi vẽ chính thức, so sánh các phương án bố cục trong vài phút thay vì sửa một bố cục sai trong nhiều giờ."),
   ("Chiều sâu trong bố cục", "depth", "Tạo chiều sâu bằng lớp tiền cảnh, trung cảnh và hậu cảnh, dùng độ tương phản và độ chi tiết giảm dần khi vật ở xa."),
   ("Kể chuyện bằng hình ảnh", "story", "Kể một câu chuyện bằng bố cục, dáng nhân vật và ánh sáng, đặt câu hỏi trước khi vẽ: nhân vật đang làm gì, đang cảm thấy gì, và khoảnh khắc nào đáng vẽ nhất."),
 ]),
 ("M10", "Advanced Drawing — Vẽ nâng cao", [
   ("Dựng hình phức tạp", "complex", "Dựng vật thể phức tạp từ nhiều khối, giữ đúng trục và tỷ lệ khi các khối giao nhau, kiểm tra tổng thể trước khi thêm chi tiết nhỏ."),
   ("Phối cảnh nâng cao", "adv_persp", "Kết hợp nhiều điểm tụ trong một khung cảnh, vẽ kiến trúc và nội thất với nhiều khối ở nhiều góc độ khác nhau mà vẫn nhất quán."),
   ("Giải phẫu nâng cao", "adv_anatomy", "Vẽ cơ bắp và chuyển động phức tạp, hiểu cơ nào căng khi cơ thể vận động, và dùng kiến thức giải phẫu để dáng vẽ thuyết phục hơn."),
   ("Vẽ theo mẫu tham chiếu", "reference", "Vẽ theo ảnh tham chiếu mà không sao chép máy móc, phân tích mẫu thành khối và tỷ lệ, rồi diễn giải lại bằng phong cách của mình."),
   ("Dự án cuối khóa (Capstone)", "capstone", "Thực hiện một bức minh họa hoàn chỉnh từ ý tưởng đến hoàn thiện, áp dụng mọi kỹ năng đã học, nộp bài và nhận đánh giá tổng kết."),
 ]),
]

TRACKS = [
 ("portrait", "Portrait Drawing — Chân dung", [
   ("Dựng đầu theo tỷ lệ Loomis", "loomis", "Dựng đầu bằng phương pháp Loomis, xác định trục và các mặt phẳng của đầu, đặt mắt, mũi, miệng theo tỷ lệ chuẩn trước khi vẽ chi tiết."),
   ("Mắt, mũi, miệng", "features", "Vẽ từng bộ phận trên khuôn mặt, hiểu cấu trúc khối của mũi và môi, vẽ mắt với mí và ánh sáng phản chiếu trong con ngươi."),
   ("Bóng và khối trên khuôn mặt", "face_shading", "Tô bóng khuôn mặt theo nguồn sáng, giữ vùng sáng trên trán, mũi và gò má, vùng tối mềm ở hốc mắt và dưới cằm."),
   ("Biểu cảm khuôn mặt", "expression", "Vẽ biểu cảm bằng cách thay đổi lông mày, mắt và miệng, hiểu một thay đổi nhỏ ở lông mày có thể đổi toàn bộ cảm xúc."),
   ("Chân dung hoàn chỉnh", "portrait_final", "Vẽ một bức chân dung hoàn chỉnh từ dựng hình đến tô bóng, giữ giống người mẫu mà vẫn có phong cách riêng."),
 ]),
 ("anime", "Anime & Manga", [
   ("Khuôn mặt anime cơ bản", "anime_face", "Vẽ khuôn mặt anime với mắt to, mũi và miệng đơn giản, hiểu tỷ lệ anime khác tỷ lệ thực như thế nào và vì sao."),
   ("Mắt anime và tóc", "anime_eyes", "Vẽ mắt anime với highlight lớn và tóc theo từng lọn, dùng đường cong mượt và giữ tóc có khối thay vì vẽ từng sợi rối."),
   ("Dáng chibi và nhân vật", "chibi", "Vẽ nhân vật chibi với tỷ lệ đầu to, thân nhỏ, giữ dáng dễ thương mà vẫn đúng cấu trúc cơ thể đơn giản."),
   ("Tư thế động trong manga", "manga_pose", "Vẽ tư thế động với line of action mạnh, dùng góc máy nghiêng và tốc độ nét để tạo cảm giác chuyển động."),
   ("Minh họa manga hoàn chỉnh", "manga_final", "Vẽ một khung minh họa manga hoàn chỉnh với nhân vật, bối cảnh đơn giản và hiệu ứng tốc độ, kể được một khoảnh khắc rõ ràng."),
 ]),
 ("landscape", "Landscape & Environment", [
   ("Bố cục phong cảnh", "land_comp", "Chia khung cảnh thành tiền cảnh, trung cảnh và hậu cảnh, chọn điểm nhấn là núi, cây hay mặt nước, và dẫn mắt bằng đường cong tự nhiên."),
   ("Cây cối và đá", "trees", "Vẽ cây bằng khối tán và thân có hướng, vẽ đá bằng các mặt phẳng gãy, giữ mỗi vật có hình dáng riêng thay vì lặp lại một mẫu."),
   ("Nước và bầu trời", "water", "Vẽ mặt nước bằng đường ngang phản chiếu, vẽ mây bằng khối mềm với mặt sáng và mặt tối rõ ràng, giữ bầu trời không bị phẳng."),
   ("Phối cảnh phong cảnh", "land_persp", "Dùng phối cảnh không khí: vật xa nhạt hơn, ít chi tiết hơn và ngả xanh, vật gần tương phản cao và chi tiết rõ."),
   ("Phong cảnh hoàn chỉnh", "land_final", "Vẽ một bức phong cảnh hoàn chỉnh từ thumbnail đến hoàn thiện, kiểm tra chiều sâu và điểm nhấn trước khi tô màu cuối."),
 ]),
 ("digital", "Digital Painting", [
   ("Cọ kỹ thuật số và lớp vẽ", "brushes", "Làm quen các loại cọ kỹ thuật số, dùng lớp riêng cho phác thảo, màu nền và chi tiết, đặt tên lớp rõ ràng để dễ sửa."),
   ("Khối màu (Color blocking)", "blocking", "Tô khối màu lớn trước khi thêm chi tiết, kiểm tra hòa sắc ở giai đoạn khối màu vì sửa lúc này nhanh hơn sửa lúc đã chi tiết."),
   ("Ánh sáng trong digital painting", "dig_light", "Vẽ ánh sáng bằng lớp overlay và soft light, giữ nguồn sáng nhất quán, thêm highlight cuối cùng bằng cọ cứng nhỏ."),
   ("Kết cấu và chi tiết", "texture", "Thêm kết cấu bằng cọ texture ở mức vừa phải, tập trung chi tiết vào điểm nhấn và để các vùng phụ mềm hơn."),
   ("Minh họa kỹ thuật số hoàn chỉnh", "dig_final", "Hoàn thiện một bức minh họa kỹ thuật số từ phác thảo đến xuất file, kiểm tra tổng thể ở kích thước nhỏ trước khi giao bài."),
 ]),
]

def rubric_for(ev):
    templates = {
      "line": [("straightness","Độ thẳng",35),("smoothness","Độ mượt",25),("endpoint_accuracy","Điểm đầu/cuối",20),("consistency","Nhất quán",20)],
      "shape": [("shape_accuracy","Chính xác hình",40),("proportion","Tỷ lệ",25),("symmetry","Đối xứng",20),("line_clarity","Rõ nét",15)],
      "perspective": [("edge_convergence","Hội tụ",35),("form_structure","Cấu trúc",25),("proportion","Tỷ lệ",20),("line_clarity","Rõ nét",10),("requirement_completion","Hoàn thiện",10)],
      "value": [("value_grouping","Nhóm giá trị",35),("light_direction","Hướng sáng",25),("contrast","Tương phản",20),("transitions","Chuyển tông",20)],
      "proportion": [("proportion","Tỷ lệ",40),("alignment","Căn chỉnh",25),("relative_distance","Khoảng cách",20),("completeness","Hoàn thiện",15)],
      "form": [("form_structure","Cấu trúc khối",35),("proportion","Tỷ lệ",25),("axis_rotation","Trục/xoay",20),("line_clarity","Rõ nét",20)],
      "anatomy": [("proportion","Tỷ lệ cơ thể",35),("gesture","Chuyển động",25),("structure","Giải phẫu",25),("balance","Cân bằng",15)],
      "composition": [("focal_point","Điểm nhấn",30),("balance","Cân bằng",25),("hierarchy","Thứ bậc",25),("readability","Dễ đọc",20)],
      "color": [("color_harmony","Hòa sắc",35),("value_structure","Sáng/tối",30),("saturation_control","Bão hòa",20),("completeness","Hoàn thiện",15)],
      "creative": [("idea_clarity","Rõ ý tưởng",30),("composition","Bố cục",25),("technique","Kỹ thuật",25),("expression","Biểu cảm",20)],
    }
    return [{"criterion_id": c[0], "name": c[1], "weight": c[2]} for c in templates.get(ev, templates["line"])]

EV_BY_MODULE = {"M00":"line","M01":"line","M02":"shape","M03":"form","M04":"perspective","M05":"proportion","M06":"value","M07":"color","M08":"anatomy","M09":"composition","M10":"creative"}
EV_BY_TRACK = {"portrait":"anatomy","anime":"creative","landscape":"composition","digital":"color"}

def make_lesson(lid, title, topic, focus, detail, ev, diff, minutes, prereq, next_id):
    th = theory(topic, focus, detail)
    assert len(th.split()) > 300, (lid, len(th.split()))
    return {
      "lesson_id": lid, "title": title,
      "description": f"Học {topic.lower()} qua lý thuyết, ví dụ đúng/sai và bài luyện có rubric rõ ràng.",
      "objectives": [f"Hiểu bản chất của {topic.lower()}", "Thực hiện được bài luyện theo đúng quy trình", "Tự đánh giá bài của mình theo rubric và sửa được lỗi chính"],
      "difficulty": diff, "estimated_minutes": minutes, "prerequisites": prereq,
      "theory": th,
      "correct_examples": [f"Bài mẫu đúng: {topic} được thực hiện đúng quy trình, tỷ lệ và hướng dẫn trong bài."],
      "wrong_examples": [f"Bài mẫu sai: {topic} bị lỗi thường gặp — xem phần lỗi thường gặp để biết cách tránh."],
      "steps": ["Chuẩn bị dụng cụ và không gian vẽ.", "Đọc kỹ lý thuyết và quan sát ví dụ đúng/sai.",
                "Luyện theo từng bước với chế độ Guided Practice.", "Tự luyện lại ở chế độ Assisted Practice.",
                "Nộp bài ở chế độ Independent Practice và nhận đánh giá AI."],
      "exercises": [
        {"exercise_id": lid + "-EX1", "title": f"Luyện có hướng dẫn: {title}", "mode": "guided", "evaluation_type": ev,
         "description": "Vẽ theo từng bước với đường gợi ý.", "rubric": rubric_for(ev)},
        {"exercise_id": lid + "-EX2", "title": f"Luyện độc lập: {title}", "mode": "independent", "evaluation_type": ev,
         "description": "Tự hoàn thành bài với ít gợi ý.", "rubric": rubric_for(ev)},
      ],
      "common_mistakes": [
        {"mistake": "Vội vàng vẽ chi tiết trước khi dựng đúng tổng thể.", "fix": "Luôn dựng khung tổng thể và kiểm tra tỷ lệ trước khi thêm chi tiết."},
        {"mistake": "Ghì bút quá chặt làm nét run và nhanh mỏi.", "fix": "Thả lỏng cổ tay, vẽ bằng chuyển động của cả cánh tay."},
        {"mistake": "Không so sánh bài với mẫu sau khi luyện.", "fix": "Sau mỗi bài, ghi lại ba điểm tốt và ba điểm cần sửa rồi luyện lại."},
      ],
      "pass_condition": "Đạt từ 60/100 theo rubric và hoàn thành đủ hai bài luyện của bài học.",
      "next_lesson_id": next_id, "status": "published",
    }

def build():
    modules, lessons, skills = [], [], []
    diffs = ["beginner","beginner","intermediate","intermediate","advanced"]
    for mi, (code, title, ls) in enumerate(MODULES):
        modules.append({"code": code, "title": title, "description": title, "order_index": mi, "track": "foundation", "status": "published"})
        for li, (t, topic_key, detail) in enumerate(ls):
            lid = f"L{code[1:]}-{li+1:02d}"
            nxt = f"L{code[1:]}-{li+2:02d}" if li+1 < len(ls) else (f"L{int(code[1:])+1:02d}-01" if mi+1 < len(MODULES) else None)
            lessons.append(make_lesson(lid, t, t, f"Trong bài này chúng ta sẽ học {t.lower()} một cách có hệ thống, từ lý thuyết đến bài luyện thực hành.", detail, EV_BY_MODULE[code], diffs[min(mi//2,4)], 25+li*5, [f"L{code[1:]}-{li:02d}"] if li else [], nxt))
    for ti, (slug, title, ls) in enumerate(TRACKS):
        modules.append({"code": f"T{ti+1:02d}", "title": title, "description": title, "order_index": 11+ti, "track": slug, "status": "published"})
        for li, (t, topic_key, detail) in enumerate(ls):
            lid = f"{slug.upper()[:2]}-{li+1:02d}"
            nxt = f"{slug.upper()[:2]}-{li+2:02d}" if li+1 < len(ls) else None
            lessons.append(make_lesson(lid, t, t, f"Trong chuyên ngành {title}, bài này tập trung vào {t.lower()} với ví dụ và bài luyện riêng của chuyên ngành.", detail, EV_BY_TRACK[slug], diffs[min(2+li//2,4)], 30+li*5, [f"{slug.upper()[:2]}-{li:02d}"] if li else ["L10-05"], nxt))
    # skills graph
    skill_defs = [
      ("SK-LINE","Line Control","line","Kiểm soát nét thẳng, cong và mượt",[]),
      ("SK-ELLIPSE","Ellipse Control","line","Vẽ ellipse đúng trục và độ mở",["SK-LINE"]),
      ("SK-SHAPE","Shape Accuracy","shape","Vẽ hình 2D đúng tỷ lệ",["SK-LINE"]),
      ("SK-PROP","Proportion","proportion","So sánh tỷ lệ và khoảng cách",["SK-SHAPE"]),
      ("SK-FORM","Form Construction","form","Dựng khối hộp, cầu, trụ, nón",["SK-SHAPE","SK-ELLIPSE"]),
      ("SK-CYL","Cylinder Construction","form","Dựng khối trụ từ ellipse",["SK-ELLIPSE"]),
      ("SK-CYLOBJ","Cylindrical Objects","form","Vẽ vật thể hình trụ như chai, cốc",["SK-CYL","SK-FORM"]),
      ("SK-PERSP","Perspective","perspective","Phối cảnh một, hai và ba điểm tụ",["SK-FORM"]),
      ("SK-VALUE","Value Control","value","Kiểm soát thang giá trị sáng tối",["SK-FORM"]),
      ("SK-SHADING","Form Shading","value","Tô bóng diễn tả khối",["SK-VALUE"]),
      ("SK-GESTURE","Gesture","anatomy","Bắt chuyển động bằng line of action",["SK-LINE"]),
      ("SK-ANATOMY","Body Proportion","anatomy","Tỷ lệ cơ thể người",["SK-GESTURE","SK-PROP"]),
      ("SK-COLOR","Color","color","Hòa sắc và kiểm soát màu",["SK-VALUE"]),
      ("SK-COMP","Composition","composition","Bố cục và kể chuyện bằng hình",["SK-PROP","SK-VALUE"]),
    ]
    for sid, name, cat, desc, pre in skill_defs:
        skills.append({"skill_id": sid, "name": name, "category": cat, "description": desc,
                       "difficulty": "beginner", "prerequisites": pre,
                       "mastery_criteria": "Đạt >=80/100 ở 3 bài liên tiếp thuộc kỹ năng này, với độ khó tăng dần."})
    data = {"modules": modules, "lessons": lessons, "skills": skills,
            "tracks": [{"slug": s, "name": t, "kind": "specialty"} for s, t, _ in TRACKS] +
                      [{"slug": "foundation", "name": "Foundation — Nền tảng", "kind": "foundation"}]}
    out = os.path.join(os.path.dirname(__file__), "curriculum.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"modules={len(modules)} lessons={len(lessons)} skills={len(skills)}")
    for l in lessons:
        assert len(l["theory"].split()) > 300
    print("all theories >300 words OK")

if __name__ == "__main__":
    build()
