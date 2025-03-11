# 获取WSL IP
$wslIp = (wsl hostname -I).Trim()
$winIp = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Ethernet).IPAddress

# 清除现有规则
netsh interface portproxy reset

# 添加所需的端口转发规则
$ports = @(80, 443, 3000, 8080) # 根据需要调整端口列表
foreach ($port in $ports) {
    netsh interface portproxy add v4tov4 listenport=$port listenaddress=$winIp connectport=$port connectaddress=$wslIp
}

Write-Host "端口转发已设置，WSL($wslIp)的请求将转发到Windows($winIp)" 