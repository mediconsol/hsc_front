// UI 컴포넌트 모듈
class UIComponents {
  
  // 데이터 테이블 생성
  static createDataTable(data, columns, options = {}) {
    const {
      className = 'min-w-full divide-y divide-gray-200',
      showHeader = true,
      emptyMessage = '데이터가 없습니다'
    } = options;

    if (!data || data.length === 0) {
      return `
        <div class="text-center py-8">
          <div class="text-sm text-gray-500">${emptyMessage}</div>
        </div>
      `;
    }

    const headerHtml = showHeader ? `
      <thead class="bg-gray-50">
        <tr>
          ${columns.map(col => `
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ${col.label}
            </th>
          `).join('')}
        </tr>
      </thead>
    ` : '';

    const bodyHtml = `
      <tbody class="bg-white divide-y divide-gray-200">
        ${data.map(row => `
          <tr class="hover:bg-gray-50">
            ${columns.map(col => `
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;

    return `
      <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table class="${className}">
          ${headerHtml}
          ${bodyHtml}
        </table>
      </div>
    `;
  }

  // 통계 카드 생성
  static createStatsCard(stats) {
    return stats.map(stat => `
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 ${stat.bgColor} rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">${stat.icon}</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">${stat.label}</dt>
                <dd class="text-lg font-medium text-gray-900">${stat.value}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 모달 다이얼로그 생성
  static createModal(id, title, content, actions = []) {
    return `
      <div id="${id}" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">${title}</h3>
              <button type="button" class="text-gray-400 hover:text-gray-600" onclick="UIComponents.closeModal('${id}')">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="modal-content">
              ${content}
            </div>
            
            ${actions.length > 0 ? `
              <div class="flex items-center justify-end pt-4 border-t space-x-3 mt-4">
                ${actions.map(action => `
                  <button type="${action.type || 'button'}" 
                          class="${action.className || 'px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'}"
                          ${action.onclick ? `onclick="${action.onclick}"` : ''}>
                    ${action.label}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // 모달 열기
  static openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  // 모달 닫기
  static closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  // 로딩 스피너 생성
  static createSpinner(size = 'medium', className = '') {
    const sizeClasses = {
      small: 'w-4 h-4 border-2',
      medium: 'w-8 h-8 border-3',
      large: 'w-12 h-12 border-4'
    };

    return `
      <div class="flex justify-center items-center ${className}">
        <div class="${sizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    `;
  }

  // 뱃지 생성
  static createBadge(text, type = 'default') {
    const typeClasses = {
      default: 'text-gray-800 bg-gray-100',
      success: 'text-green-800 bg-green-100',
      warning: 'text-yellow-800 bg-yellow-100',
      error: 'text-red-800 bg-red-100',
      info: 'text-blue-800 bg-blue-100'
    };

    return `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[type]}">
        ${text}
      </span>
    `;
  }

  // 확인 다이얼로그
  static confirm(message, onConfirm, onCancel = null) {
    const confirmed = window.confirm(message);
    if (confirmed && onConfirm) {
      onConfirm();
    } else if (!confirmed && onCancel) {
      onCancel();
    }
    return confirmed;
  }

  // 요소 표시/숨김 토글
  static toggleElement(elementId, show = null) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (show === null) {
      element.classList.toggle('hidden');
    } else if (show) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }

  // 폼 데이터를 객체로 변환
  static formDataToObject(formElement) {
    const formData = new FormData(formElement);
    const obj = {};
    
    for (let [key, value] of formData.entries()) {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          obj[key].push(value);
        } else {
          obj[key] = [obj[key], value];
        }
      } else {
        obj[key] = value;
      }
    }
    
    return obj;
  }

  // 폼 리셋
  static resetForm(formElement) {
    if (typeof formElement === 'string') {
      formElement = document.getElementById(formElement);
    }
    
    if (formElement) {
      formElement.reset();
      // 검증 상태도 초기화
      const fields = formElement.querySelectorAll('.form-field');
      fields.forEach(field => {
        field.classList.remove('valid', 'invalid', 'validating');
      });
    }
  }
}

// 전역 사용 가능하도록 export
window.UIComponents = UIComponents;